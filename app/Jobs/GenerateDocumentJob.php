<?php

namespace App\Jobs;

use App\Models\Document;
use App\Services\DocumentGenerationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class GenerateDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $document;
    protected $metaDataValues;
    protected $categoryNumberingId;

    public function __construct(Document $document, array $metaDataValues, ?int $categoryNumberingId)
    {
        $this->document = $document;
        $this->metaDataValues = $metaDataValues;
        $this->categoryNumberingId = $categoryNumberingId;
    }

    public function handle(DocumentGenerationService $documentGenerationService): void
    {
        try {
            $documentGenerationService->generate(
                $this->document,
                $this->metaDataValues,
                $this->categoryNumberingId
            );
        } catch (Throwable $e) {
            Log::error('GenerateDocumentJob failed', [
                'document_id' => $this->document->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
