<?php

namespace App\Jobs;

use App\Models\Document;
use App\Models\IncomingMail;
use App\Models\DocumentHistory;
use App\Enums\StatusDocument;
use App\Enums\RecipientType;
use App\Contracts\StorageServiceInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessIncomingMailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $tempFilePath;
    protected $extension;
    protected $data;
    protected $authId;

    public function __construct(string $tempFilePath, string $extension, array $data, string $authId)
    {
        $this->tempFilePath = $tempFilePath;
        $this->extension = $extension;
        $this->data = $data;
        $this->authId = $authId;
    }

    public function handle(StorageServiceInterface $storageService): void
    {
        try {
            DB::transaction(function () use ($storageService) {
                $path = $storageService->uploadFile(
                    $this->tempFilePath, 
                    'documents', 
                    'document', 
                    $this->extension
                );

                $document = Document::create([
                    'title' => $this->data['title'],
                    'status' => StatusDocument::ARCHIVED,
                    'recipient_type' => RecipientType::EXTERNAL,
                    'meta_data_values' => [],
                    'current_url' => $path,
                    'created_by' => $this->authId,
                ]);

                IncomingMail::create([
                    'document_id' => $document->id,
                    'sender_origin' => $this->data['sender_origin'],
                    'received_at' => $this->data['received_at'],
                ]);

                DocumentHistory::create([
                    'document_id' => $document->id,
                    'file_path' => $path,
                    'version_name' => StatusDocument::ARCHIVED,
                    'note' => "Incoming external document from {$this->data['sender_origin']}.",
                    'created_by' => $this->authId,
                    'created_at' => now(),
                ]);
            });

            if (file_exists($this->tempFilePath)) {
                unlink($this->tempFilePath);
            }

        } catch (Throwable $e) {
            Log::error('ProcessIncomingMailJob failed', [
                'title' => $this->data['title'],
                'error' => $e->getMessage()
            ]);
            
            if (file_exists($this->tempFilePath)) {
                unlink($this->tempFilePath);
            }
            
            throw $e;
        }
    }

    public function failed(Throwable $exception): void
    {
        if (file_exists($this->tempFilePath)) {
            unlink($this->tempFilePath);
        }
    }
}
