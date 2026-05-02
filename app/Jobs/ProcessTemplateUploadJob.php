<?php

namespace App\Jobs;

use App\Models\Template;
use App\Services\S3StorageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessTemplateUploadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $tempFilePath;
    protected $title;
    protected $metadata;

    /**
     * Create a new job instance.
     */
    public function __construct(string $tempFilePath, string $title, array $metadata)
    {
        $this->tempFilePath = $tempFilePath;
        $this->title = $title;
        $this->metadata = $metadata;
    }

    /**
     * Execute the job.
     */
    public function handle(S3StorageService $storageService): void
    {
        try {
            // 1. Upload to S3
            $filePath = $storageService->uploadFile(
                $this->tempFilePath,
                'templates',
                'document'
            );

            // 2. Save to Database
            Template::create([
                'name' => $this->title,
                'url'  => $filePath,
                'meta_data' => $this->metadata
            ]);

            // 3. Clean up temp file
            if (file_exists($this->tempFilePath)) {
                unlink($this->tempFilePath);
            }

            Log::info('Template processed successfully', ['title' => $this->title]);

        } catch (Throwable $e) {
            Log::error('Template processing failed', [
                'title' => $this->title,
                'error' => $e->getMessage()
            ]);
            
            // Clean up temp file on failure too
            if (file_exists($this->tempFilePath)) {
                unlink($this->tempFilePath);
            }
            
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        Log::error('ProcessTemplateUploadJob failed final attempt', [
            'title' => $this->title,
            'error' => $exception->getMessage()
        ]);

        if (file_exists($this->tempFilePath)) {
            unlink($this->tempFilePath);
        }
    }
}
