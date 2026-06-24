<?php

namespace App\Http\Controllers;

use App\Models\Template;
use App\Contracts\StorageServiceInterface;
use App\Services\DocumentTemplateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    protected $storageService;

    public function __construct(StorageServiceInterface $storageService)
    {
        $this->storageService = $storageService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');

        $templates = Template::latest()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->paginate(20)
            ->withQueryString()
            ->through(function ($template) {
                return [
                    'id' => $template->id,
                    'name' => $template->name,
                    'url' => $template->url,
                    'meta_data' => $template->meta_data,
                    'created_at' => $template->created_at->toDateTimeString(),
                ];
            });

        return Inertia::render('templates/index', [
            'templates' => $templates,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'document'    => 'required|string',
            'metadata'    => 'nullable|array',
        ]);

        try {
            if (!str_contains($request->document, 'base64,')) {
                return back()->withErrors(['document' => 'Format Base64 tidak valid']);
            }

            [$meta, $data] = explode(',', $request->document, 2);
            $binary = base64_decode($data);
            
            if ($binary === false) {
                return back()->withErrors(['document' => 'Gagal mendekode data Base64']);
            }

            $tempDir = storage_path('app/temp_uploads');
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            $extension = 'docx';
            if (preg_match('/data:(.*?);base64/', $meta, $matches)) {
                $mime = $matches[1];
                $extension = match ($mime) {
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
                    'application/msword' => 'doc',
                    'application/pdf' => 'pdf',
                    default => 'docx'
                };
            }

            $tempFileName = 'tpl_' . uniqid() . '.' . $extension;
            $tempFilePath = $tempDir . DIRECTORY_SEPARATOR . $tempFileName;
            
            file_put_contents($tempFilePath, $binary);

            if (env('USE_QUEUE', true)) {
                \App\Jobs\ProcessTemplateUploadJob::dispatch(
                    $tempFilePath,
                    $request->title,
                    $request->metadata ?? []
                );

                return back()->with('success', 'Upload template sedang diproses di background. Silakan refresh halaman beberapa saat lagi.');
            } else {
                $filePath = $this->storageService->uploadFile(
                    $tempFilePath,
                    'templates',
                    'document'
                );

                Template::create([
                    'name' => $request->title,
                    'url'  => $filePath,
                    'meta_data' => $request->metadata ?? []
                ]);

                if (file_exists($tempFilePath)) {
                    unlink($tempFilePath);
                }

                return back()->with('success', 'Template berhasil ditambahkan!');
            }

        } catch (\Throwable $e) {
            return back()->withErrors(['document' => 'Gagal memproses data: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Template $template)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'metadata'    => 'nullable|array',
        ]);

        try {
            $metaData = $template->meta_data;
            $metaData['placeholders'] = $request->metadata ?? [];

            $template->update([
                'name' => $request->title,
                'meta_data' => $metaData,
            ]);

            return back()->with('success', 'Template berhasil diperbarui!');
        } catch (\Throwable $e) {
            return back()->withErrors(['title' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy(Template $template)
    {
        try {
            $this->storageService->delete($template->url);

            $template->delete();

            return back()->with('success', 'Template berhasil dihapus!');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal menghapus template: ' . $e->getMessage()]);
        }
    }

    public function preview(Template $template)
    {
        try {
            $diskName = $this->storageService->getDiskName();
            if ($diskName === 'public' || $diskName === 'local') {
                $url = $this->storageService->getUrl($template->url);
                return Inertia::location($url);
            }

            $url = $this->storageService->getTemporaryUrl($template->url);
            return Inertia::location($url);
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal membuat link pratinjau: ' . $e->getMessage()]);
        }
    }

    public function download(Template $template)
    {
        try {
            $diskName = $this->storageService->getDiskName();
            if ($diskName === 'public' || $diskName === 'local') {
                return \Illuminate\Support\Facades\Storage::disk($diskName)->download($template->url, $template->name . '.docx');
            }

            $url = $this->storageService->getTemporaryUrl($template->url, 10, true, $template->name . '.docx');
            return Inertia::location($url);
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal membuat link unduhan: ' . $e->getMessage()]);
        }
    }

    public function extractVariables(Request $request, DocumentTemplateService $templateService)
    {
        $request->validate([
            'document' => 'required|string',
        ]);

        try {
            if (!str_contains($request->document, 'base64,')) {
                return response()->json(['error' => 'Format Base64 tidak valid'], 400);
            }

            [$meta, $data] = explode(',', $request->document, 2);
            $binary = base64_decode($data);
            
            if ($binary === false) {
                return response()->json(['error' => 'Gagal mendekode data Base64'], 400);
            }

            $tempDir = storage_path('app/temp_uploads');
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            $extension = 'docx';
            if (preg_match('/data:(.*?);base64/', $meta, $matches)) {
                $mime = $matches[1];
                $extension = match ($mime) {
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
                    'application/msword' => 'doc',
                    default => 'docx'
                };
            }

            if ($extension !== 'docx') {
                return response()->json(['error' => 'Format file tidak didukung untuk ekstraksi variabel, gunakan .docx'], 400);
            }

            $tempFileName = 'extract_' . uniqid() . '.' . $extension;
            $tempFilePath = $tempDir . DIRECTORY_SEPARATOR . $tempFileName;
            
            file_put_contents($tempFilePath, $binary);

            $variables = $templateService->extractVariables($tempFilePath);

            if (file_exists($tempFilePath)) {
                unlink($tempFilePath);
            }

            return response()->json([
                'success' => true,
                'variables' => $variables
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Gagal mengekstrak variabel: ' . $e->getMessage()
            ], 500);
        }
    }
}