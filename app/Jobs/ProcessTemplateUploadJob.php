<?php

namespace App\Jobs;

use App\Models\Template;
use App\Contracts\StorageServiceInterface;
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
    public function handle(StorageServiceInterface $storageService): void
    {
        try {
            $filePath = $storageService->uploadFile(
                $this->tempFilePath,
                'templates',
                'document'
            );

            Template::create([
                'name' => $this->title,
                'url'  => $filePath,
                'meta_data' => $this->metadata
            ]);

            if (file_exists($this->tempFilePath)) {
                unlink($this->tempFilePath);
            }

        } catch (Throwable $e) {
            Log::error('Template processing failed', [
                'title' => $this->title,
                'error' => $e->getMessage()
            ]);
            
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
