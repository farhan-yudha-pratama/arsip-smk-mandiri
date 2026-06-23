<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Enums\RecipientType;
use App\Enums\StatusDocument;
use App\Models\CategoryNumbering;
use App\Models\Document;
use App\Models\DocumentHistory;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Template;
use App\Contracts\StorageServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Str;
use App\Services\DocumentGenerationService;
use App\Models\IncomingMail;
use App\Models\OutgoingMail;

class DocumentController extends Controller
{
    protected $storageService;

    public function __construct(StorageServiceInterface $storageService)
    {
        $this->storageService = $storageService;
    }

    public function incomingIndex(Request $request)
    {
        $search = $request->query('search');
        $statusFilter = $request->query('status');

        $documents = Document::has('incomingMail')
            ->with(['incomingMail', 'creator', 'history.creator'])
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', '%' . $search . '%');
            })
            ->when($statusFilter && $statusFilter !== 'ALL', function ($query) use ($statusFilter) {
                $query->where('status', $statusFilter);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('documents/incoming', [
            'documents' => $documents,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function outgoingIndex(Request $request)
    {
        $search = $request->query('search');
        $statusFilter = $request->query('status');
        $recipientFilter = $request->query('recipient');

        $documents = Document::doesntHave('incomingMail')
            ->with(['template', 'students', 'teachers', 'creator', 'history.creator'])
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', '%' . $search . '%');
            })
            ->when($statusFilter && $statusFilter !== 'ALL', function ($query) use ($statusFilter) {
                $query->where('status', $statusFilter);
            })
            ->when($recipientFilter && $recipientFilter !== 'ALL', function ($query) use ($recipientFilter) {
                $query->where('recipient_type', $recipientFilter);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $templates         = Template::all();
        $students          = Student::all();
        $teachers          = Teacher::all();
        $categoryNumbering = CategoryNumbering::orderBy('letter_code')->get();

        return Inertia::render('documents/outgoing', [
            'documents'         => $documents,
            'templates'         => $templates,
            'students'          => $students,
            'teachers'          => $teachers,
            'categoryNumbering' => $categoryNumbering,
            'recipientTypes'    => RecipientType::cases(),
            'filters'           => $request->only('search', 'status', 'recipient'),
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'template_id'           => 'required|exists:templates,id',
            'title'                 => 'required|string|max:255',
            'recipient_type'        => 'required|string',
            'student_id'            => 'nullable|exists:students,id',
            'teacher_id'            => 'nullable|exists:teachers,id',
            'student_ids'           => 'nullable|array',
            'student_ids.*'         => 'exists:students,id',
            'teacher_ids'           => 'nullable|array',
            'teacher_ids.*'         => 'exists:teachers,id',
            'meta_data_values'      => 'nullable|array',
            'is_draft'              => 'nullable|boolean',
            'is_batch'              => 'nullable|boolean',
            'category_numbering_id' => 'nullable|exists:category_numbering,id',
            'recipient_name'        => 'nullable|string|max:255',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $template = Template::findOrFail($request->template_id);

                $isDraft = $request->boolean('is_draft');
                $isBatch = $request->boolean('is_batch');
                $status = $isDraft ? StatusDocument::DRAFT : StatusDocument::PROCESSING;

                $document = Document::create([
                    'template_id' => $template->id,
                    'title' => $request->title,
                    'status' => $status,
                    'recipient_type' => $request->recipient_type,
                    'recipient_name' => $request->recipient_name,
                    'meta_data_values' => $request->meta_data_values ?? [],
                    'current_url' => '',
                    'is_batch' => $isBatch,
                    'created_by' => Auth::id(),
                ]);

                // Handle recipients via pivot tables (since columns were dropped from documents table)
                if ($request->recipient_type === 'STUDENT') {
                    $ids = $isBatch ? ($request->student_ids ?? []) : (array)$request->student_id;
                    $document->students()->sync(array_filter($ids));
                } elseif ($request->recipient_type === 'TEACHER') {
                    $ids = $isBatch ? ($request->teacher_ids ?? []) : (array)$request->teacher_id;
                    $document->teachers()->sync(array_filter($ids));
                }

                DocumentHistory::create([
                    'document_id' => $document->id,
                    'file_path' => '',
                    'version_name' => $status,
                    'note' => $isDraft ? 'Document saved as draft.' : 'Generation started in background.',
                    'created_by' => Auth::id(),
                    'created_at' => now(),
                ]);


                if (!$isDraft) {
                    app(DocumentGenerationService::class)->generate(
                        $document,
                        $request->meta_data_values ?? [],
                        $request->integer('category_numbering_id') ?: null,
                    );
                    return back()->with('success', 'Dokumen berhasil dibuat!');
                }

                return back()->with('success', 'Dokumen disimpan sebagai draf!');
            });
        } catch (\Exception $e) {
            Log::error('DocumentController@store exception', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->withErrors(['error' => 'Gagal memulai pembuatan dokumen: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Document $document)
    {
        if (!in_array($document->status, [StatusDocument::DRAFT, StatusDocument::FAILED, StatusDocument::GENERATED])) {
            return back()->withErrors(['error' => 'Hanya dokumen draf, gagal, atau yang sudah dibuat yang dapat diubah.']);
        }

        $request->validate([
            'title'                 => 'required|string|max:255',
            'meta_data_values'      => 'nullable|array',
            'is_draft'              => 'nullable|boolean',
            'category_numbering_id' => 'nullable|exists:category_numbering,id',
            'recipient_name'        => 'nullable|string|max:255',
        ]);

        try {
            return DB::transaction(function () use ($request, $document) {
                $isDraft = $request->boolean('is_draft');
                $status = $isDraft ? StatusDocument::DRAFT : StatusDocument::PROCESSING;

                $document->update([
                    'title' => $request->title,
                    'meta_data_values' => $request->meta_data_values ?? [],
                    'status' => $status,
                    'recipient_name' => $request->recipient_name,
                ]);

                DocumentHistory::create([
                    'document_id' => $document->id,
                    'file_path' => '',
                    'version_name' => $status,
                    'note' => $isDraft ? 'Draft updated.' : 'Generation started from update.',
                    'created_by' => Auth::id(),
                    'created_at' => now(),
                ]);

                if (!$isDraft) {
                    app(DocumentGenerationService::class)->generate(
                        $document,
                        $request->meta_data_values ?? [],
                        $request->integer('category_numbering_id') ?: null,
                    );
                    return back()->with('success', 'Dokumen berhasil dibuat!');
                }

                return back()->with('success', 'Draf berhasil diperbarui!');
            });
        } catch (\Exception $e) {
            Log::error('DocumentController@update exception', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Gagal memperbarui dokumen: ' . $e->getMessage()]);
        }
    }

    public function download(Document $document)
    {
        try {
            $extension = pathinfo($document->current_url, PATHINFO_EXTENSION) ?: 'pdf';
            $filename = $document->title . '.' . $extension;
            $diskName = $this->storageService->getDiskName();
            if ($diskName === 'public' || $diskName === 'local') {
                return Storage::disk($diskName)->download($document->current_url, $filename);
            }

            $url = $this->storageService->getTemporaryUrl($document->current_url, 10, true, $filename);
            return Inertia::location($url);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal membuat tautan unduhan: ' . $e->getMessage()]);
        }
    }

    public function downloadHistory(Document $document, DocumentHistory $history)
    {
        if (!$history->file_path) {
            return back()->withErrors(['error' => 'File tidak ditemukan untuk versi riwayat ini.']);
        }

        try {
            $versionName = $history->version_name->value ?? $history->version_name;
            $extension = pathinfo($history->file_path, PATHINFO_EXTENSION) ?: 'pdf';
            $filename = $document->title . ' - ' . $versionName . '.' . $extension;
            $diskName = $this->storageService->getDiskName();
            if ($diskName === 'public' || $diskName === 'local') {
                return Storage::disk($diskName)->download($history->file_path, $filename);
            }

            $url = $this->storageService->getTemporaryUrl($history->file_path, 10, true, $filename);
            return Inertia::location($url);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal membuat tautan unduhan: ' . $e->getMessage()]);
        }
    }

    public function destroy(Document $document)
    {
        try {
            return DB::transaction(function () use ($document) {
                foreach ($document->history as $history) {
                    $this->storageService->delete($history->file_path);
                }

                $this->storageService->delete($document->current_url);

                $document->delete();

                return back()->with('success', 'Dokumen berhasil dihapus!');
            });
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus dokumen: ' . $e->getMessage()]);
        }
    }
    public function uploadSigned(Request $request, Document $document)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        try {
            return DB::transaction(function () use ($request, $document) {
                $file = $request->file('file');
                $path = $this->storageService->uploadFile(
                    $file->getRealPath(), 
                    'documents', 
                    'document', 
                    $file->getClientOriginalExtension()
                );

                $document->update([
                    'status' => StatusDocument::SIGNED,
                    'current_url' => $path,
                ]);

                $recipientName = $document->recipient_name;

                DocumentHistory::create([
                    'document_id' => $document->id,
                    'file_path' => $path,
                    'version_name' => StatusDocument::SIGNED,
                    'note' => "Signed document uploaded for {$recipientName}.",
                    'created_by' => Auth::id(),
                    'created_at' => now(),
                ]);

                return back()->with('success', 'Dokumen yang ditandatangani berhasil diunggah!');
            });
        } catch (\Exception $e) {
            Log::error('Upload Signed Failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Gagal mengunggah dokumen yang ditandatangani: ' . $e->getMessage()]);
        }
    }

    public function archive(Document $document)
    {
        try {
            return DB::transaction(function () use ($document) {
                $document->update([
                    'status' => StatusDocument::ARCHIVED,
                ]);

                $recipientName = $document->recipient_name;

                DocumentHistory::create([
                    'document_id' => $document->id,
                    'file_path' => $document->current_url,
                    'version_name' => StatusDocument::ARCHIVED,
                    'note' => "Document finished and archived for {$recipientName}.",
                    'created_by' => Auth::id(),
                    'created_at' => now(),
                ]);

                return back()->with('success', 'Dokumen berhasil diarsipkan!');
            });
        } catch (\Exception $e) {
            Log::error('Archive Failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Gagal mengarsipkan dokumen: ' . $e->getMessage()]);
        }
    }

    public function storeIncoming(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'sender_origin' => 'required|string|max:255',
            'received_at' => 'required|date',
            'file' => 'required|file|mimes:pdf,docx,doc|max:10240',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $file = $request->file('file');
                $path = $this->storageService->uploadFile(
                    $file->getRealPath(), 
                    'documents', 
                    'document', 
                    $file->getClientOriginalExtension()
                );

                $document = Document::create([
                    'title' => $request->title,
                    'status' => StatusDocument::ARCHIVED,
                    'recipient_type' => RecipientType::EXTERNAL,
                    'meta_data_values' => [],
                    'current_url' => $path,
                    'created_by' => Auth::id(),
                ]);

                IncomingMail::create([
                    'document_id' => $document->id,
                    'sender_origin' => $request->sender_origin,
                    'received_at' => $request->received_at,
                ]);

                DocumentHistory::create([
                    'document_id' => $document->id,
                    'file_path' => $path,
                    'version_name' => StatusDocument::ARCHIVED,
                    'note' => "Incoming external document from {$request->sender_origin}.",
                    'created_by' => Auth::id(),
                    'created_at' => now(),
                ]);

                return back()->with('success', 'Surat masuk berhasil didaftarkan!');
            });
        } catch (\Exception $e) {
            Log::error('Store Incoming Failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Gagal mendaftar surat masuk: ' . $e->getMessage()]);
        }
    }
}