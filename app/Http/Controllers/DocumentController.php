<?php

namespace App\Http\Controllers;

use App\Enums\RecipientType;
use App\Enums\StatusDocument;
use App\Models\Document;
use App\Models\DocumentHistory;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Template;
use App\Services\S3StorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Str;
use App\Jobs\GenerateDocumentJob;

class DocumentController extends Controller
{
    protected $storageService;

    public function __construct(S3StorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    public function index()
    {
        $documents = Document::with(['template', 'student', 'teacher', 'creator', 'history.creator'])
            ->latest()
            ->get();

        $templates = Template::all();
        $students = Student::all();
        $teachers = Teacher::all();

        return Inertia::render('documents/index', [
            'documents' => $documents,
            'templates' => $templates,
            'students' => $students,
            'teachers' => $teachers,
            'recipientTypes' => RecipientType::cases(),
        ]);
    }

    public function store(Request $request)
    {
        Log::info('DocumentController@store hit', $request->all());

        $request->validate([
            'template_id' => 'required|exists:templates,id',
            'title' => 'required|string|max:255',
            'recipient_type' => 'required|string',
            'student_id' => 'nullable|exists:students,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'meta_data_values' => 'nullable|array',
            'is_draft' => 'nullable|boolean',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $template = Template::findOrFail($request->template_id);

                $isDraft = $request->boolean('is_draft');
                $status = $isDraft ? StatusDocument::DRAFT : StatusDocument::PROCESSING;

                // 1. Create Document record with status
                $document = Document::create([
                    'template_id' => $template->id,
                    'title' => $request->title,
                    'status' => $status,
                    'recipient_type' => $request->recipient_type,
                    'student_id' => $request->student_id,
                    'teacher_id' => $request->teacher_id,
                    'meta_data_values' => $request->meta_data_values ?? [],
                    'current_url' => '', // Will be filled by job
                    'created_by' => Auth::id(),
                ]);

                // 2. Create History record
                DocumentHistory::create([
                    'document_id' => $document->id,
                    'file_path' => '',
                    'version_name' => $status,
                    'note' => $isDraft ? 'Document saved as draft.' : 'Generation started in background.',
                    'created_by' => Auth::id(),
                    'created_at' => now(),
                ]);

                Log::info('Document record created', ['id' => $document->id]);
                Log::info('Using Template', ['id' => $template->id, 'name' => $template->name]);

                if (!$isDraft) {
                    // 3. Dispatch Job
                    GenerateDocumentJob::dispatch($document, $request->meta_data_values ?? []);
                    return back()->with('success', 'Document generation started in background!');
                }

                return back()->with('success', 'Document saved as draft!');
            });
        } catch (\Exception $e) {
            Log::error('DocumentController@store exception', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->withErrors(['error' => 'Failed to start document generation: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Document $document)
    {
        if ($document->status !== StatusDocument::DRAFT) {
            return back()->withErrors(['error' => 'Only draft documents can be modified.']);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'meta_data_values' => 'nullable|array',
            'is_draft' => 'nullable|boolean',
        ]);

        try {
            return DB::transaction(function () use ($request, $document) {
                $isDraft = $request->boolean('is_draft');
                $status = $isDraft ? StatusDocument::DRAFT : StatusDocument::PROCESSING;

                $document->update([
                    'title' => $request->title,
                    'meta_data_values' => $request->meta_data_values ?? [],
                    'status' => $status,
                ]);

                DocumentHistory::create([
                    'document_id' => $document->id,
                    'file_path' => '',
                    'version_name' => $status,
                    'note' => $isDraft ? 'Draft updated.' : 'Generation started from draft.',
                    'created_by' => Auth::id(),
                    'created_at' => now(),
                ]);

                if (!$isDraft) {
                    GenerateDocumentJob::dispatch($document, $request->meta_data_values ?? []);
                    return back()->with('success', 'Document generation started in background!');
                }

                return back()->with('success', 'Draft updated successfully!');
            });
        } catch (\Exception $e) {
            Log::error('DocumentController@update exception', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to update document: ' . $e->getMessage()]);
        }
    }

    public function download(Document $document)
    {
        try {
            $url = $this->storageService->getTemporaryUrl($document->current_url, 10, true, $document->title . '.docx');
            return Inertia::location($url);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to generate download link: ' . $e->getMessage()]);
        }
    }

    public function downloadHistory(Document $document, DocumentHistory $history)
    {
        if (!$history->file_path) {
            return back()->withErrors(['error' => 'File not found for this history version.']);
        }

        try {
            $versionName = $history->version_name->value ?? $history->version_name;
            $url = $this->storageService->getTemporaryUrl($history->file_path, 10, true, $document->title . ' - ' . $versionName . '.docx');
            return Inertia::location($url);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to generate download link: ' . $e->getMessage()]);
        }
    }

    public function destroy(Document $document)
    {
        try {
            return DB::transaction(function () use ($document) {
                // Delete all files associated with history
                foreach ($document->history as $history) {
                    $this->storageService->delete($history->file_path);
                }

                // Delete current file if not in history (redundant but safe)
                $this->storageService->delete($document->current_url);

                $document->delete();

                return back()->with('success', 'Document deleted successfully!');
            });
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete document: ' . $e->getMessage()]);
        }
    }
}
