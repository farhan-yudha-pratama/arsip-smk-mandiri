<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use App\Enums\StatusDocument;
use App\Models\Document;
use App\Models\DocumentHistory;
use App\Notifications\DocumentGenerationFailedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Str;
use Throwable;

class GenerateDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $document;
    protected $metaDataValues;

    /**
     * Create a new job instance.
     */
    public function __construct(Document $document, array $metaDataValues)
    {
        $this->document = $document;
        $this->metaDataValues = $metaDataValues;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        ini_set('memory_limit', '512M');
        
        Log::info('Starting document generation', ['document_id' => $this->document->id]);

        $template = $this->document->template;

        // 1. Download template from S3 to temp local file
        Log::info('Downloading template from S3', ['url' => $template->url]);
        $templateContent = Storage::disk('s3')->get($template->url);
        $tempTemplatePath = tempnam(sys_get_temp_dir(), 'tpl');
        file_put_contents($tempTemplatePath, $templateContent);

        // 2. Process Template
        Log::info('Processing template with placeholders', ['placeholders' => array_keys($this->metaDataValues)]);
        $templateProcessor = new TemplateProcessor($tempTemplatePath);
        
        // Set custom macro characters to {{ and }}
        $templateProcessor->setMacroChars('{{', '}}');
        
        foreach ($this->metaDataValues as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // Reset macro characters back to default to avoid affecting other jobs
        $templateProcessor->setMacroChars('${', '}');

        $tempOutputPath = tempnam(sys_get_temp_dir(), 'doc');
        $templateProcessor->saveAs($tempOutputPath);

        // 3. Upload generated file to S3
        $fileName = 'documents/' . Str::uuid() . '.docx';
        Log::info('Uploading generated document to S3', ['path' => $fileName]);
        $stream = fopen($tempOutputPath, 'r');
        Storage::disk('s3')->put($fileName, $stream);
        fclose($stream);

        // Clean up temp files
        if (file_exists($tempTemplatePath)) unlink($tempTemplatePath);
        if (file_exists($tempOutputPath)) unlink($tempOutputPath);

        // 4. Update Document record
        $this->document->update([
            'status' => StatusDocument::GENERATED,
            'current_url' => $fileName,
        ]);

        // 5. Create History record
        DocumentHistory::create([
            'document_id' => $this->document->id,
            'file_path' => $fileName,
            'version_name' => StatusDocument::GENERATED,
            'note' => 'Generated successfully in background from template: ' . $template->name,
            'created_by' => $this->document->created_by,
            'created_at' => now(),
        ]);

        Log::info('Document generation completed successfully', ['document_id' => $this->document->id]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        $this->document->update([
            'status' => StatusDocument::FAILED,
        ]);

        DocumentHistory::create([
            'document_id' => $this->document->id,
            'file_path' => '',
            'version_name' => StatusDocument::FAILED,
            'note' => 'Generation failed: ' . $exception->getMessage(),
            'created_by' => $this->document->created_by,
            'created_at' => now(),
        ]);

        // Notify the user
        $this->document->creator->notify(new DocumentGenerationFailedNotification($this->document, $exception->getMessage()));
    }
}
