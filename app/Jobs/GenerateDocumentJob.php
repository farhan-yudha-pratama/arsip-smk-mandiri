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
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\IOFactory;
use App\Models\OutgoingMail;
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

        // 3. Convert DOCX to PDF
        Log::info('Converting DOCX to PDF');
        
        // Configure PDF renderer (DomPDF)
        Settings::setPdfRendererName(Settings::PDF_RENDERER_DOMPDF);
        Settings::setPdfRendererPath(base_path('vendor/dompdf/dompdf'));

        $phpWord = IOFactory::load($tempOutputPath);
        $tempPdfPath = tempnam(sys_get_temp_dir(), 'pdf') . '.pdf';
        
        $xmlWriter = IOFactory::createWriter($phpWord, 'PDF');
        $xmlWriter->save($tempPdfPath);

        // 4. Upload generated PDF to S3
        $fileName = 'documents/' . Str::uuid() . '.pdf';
        Log::info('Uploading generated PDF to S3', ['path' => $fileName]);
        $stream = fopen($tempPdfPath, 'r');
        Storage::disk('s3')->put($fileName, $stream);
        fclose($stream);

        // Clean up temp files
        if (file_exists($tempTemplatePath)) unlink($tempTemplatePath);
        if (file_exists($tempOutputPath)) unlink($tempOutputPath);
        if (file_exists($tempPdfPath)) unlink($tempPdfPath);

        // 5. Update Document record
        $this->document->update([
            'status' => StatusDocument::GENERATED,
            'current_url' => $fileName,
        ]);

        // Get Recipient Name for history and mail
        $recipientName = $this->document->student->name ?? $this->document->teacher->name ?? 'External';

        // 6. Record in Outgoing Mail
        OutgoingMail::create([
            'document_id' => $this->document->id,
            'recipient_name' => $recipientName,
            'sent_at' => now(),
        ]);

        // 7. Create History record
        DocumentHistory::create([
            'document_id' => $this->document->id,
            'file_path' => $fileName,
            'version_name' => StatusDocument::GENERATED,
            'note' => "Generated successfully as PDF for {$recipientName}. Template: " . $template->name,
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
