<?php

namespace App\Http\Controllers;

use App\Models\Template;
use App\Services\S3StorageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    protected $storageService;

    public function __construct(S3StorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    public function index()
    {
        $templates = Template::latest()->get()->map(function ($template) {
            return [
                'id' => $template->id,
                'name' => $template->name,
                'url' => $template->url,
                'meta_data' => $template->meta_data,
                'created_at' => $template->created_at->toDateTimeString(),
            ];
        });

        return Inertia::render('templates/index', [
            'templates' => $templates
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
            // 1. Upload ke S3 melalui Service
            $filePath = $this->storageService->uploadBase64(
                $request->document, 
                'templates', 
                'document'
            );

            $metaData = $request->meta_data;
            $metaData['placeholders'] = $request->metadata ?? [];

            // 2. Simpan ke Database menggunakan Model Template
            Template::create([
                'name' => $request->title,
                'url'  => $filePath,
                'meta_data' => $request->metadata ?? []
            ]);

            return back()->with('success', 'Template dan Meta Data berhasil disimpan!');

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
            // Hapus file dari S3
            $this->storageService->delete($template->url);

            // Hapus dari database
            $template->delete();

            return back()->with('success', 'Template berhasil dihapus!');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal menghapus template: ' . $e->getMessage()]);
        }
    }

    public function preview(Template $template)
    {
        try {
            $url = $this->storageService->getTemporaryUrl($template->url);
            return Inertia::location($url);
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal membuat link pratinjau: ' . $e->getMessage()]);
        }
    }

    public function download(Template $template)
    {
        try {
            $url = $this->storageService->getTemporaryUrl($template->url, 10, true, $template->name . '.docx');
            return Inertia::location($url);
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal membuat link unduhan: ' . $e->getMessage()]);
        }
    }
}