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

        $template = $this->document->template;
        
        $tempTemplatePath = '';
        $tempDocxPath = '';
        $tempPdfPath = '';

        try {
            $templateContent = Storage::disk('s3')->get($template->url);
            $tempTemplatePath = tempnam(sys_get_temp_dir(), 'tpl');
            file_put_contents($tempTemplatePath, $templateContent);

            $templateProcessor = new TemplateProcessor($tempTemplatePath);
            
            $templateProcessor->setMacroChars('{{', '}}');
            
            foreach ($this->metaDataValues as $key => $value) {
                $templateProcessor->setValue($key, $value);
            }

            $templateProcessor->setMacroChars('${', '}');

            // Save docx file with explicit .docx extension for LibreOffice
            $tempDocxPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . uniqid('doc_') . '.docx';
            $templateProcessor->saveAs($tempDocxPath);

            // Convert to PDF using LibreOffice
            $tempPdfDir = sys_get_temp_dir();
            
            $sofficePath = env('LIBREOFFICE_PATH');

            if (!$sofficePath) {
                if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                    // Cek lokasi standar Windows
                    $standardPaths = [
                        'C:\Program Files\LibreOffice\program\soffice.exe',
                        'C:\Program Files (x86)\LibreOffice\program\soffice.exe',
                    ];
                    foreach ($standardPaths as $path) {
                        if (file_exists($path)) {
                            $sofficePath = $path;
                            break;
                        }
                    }
                }
                
                // Fallback jika tidak ditemukan atau bukan Windows
                if (!$sofficePath) {
                    $sofficePath = 'soffice';
                }
            }

            // Memastikan path dibungkus kutip jika mengandung spasi dan belum dibungkus
            $executable = (strpos($sofficePath, ' ') !== false && strpos($sofficePath, '"') === false) 
                ? '"' . $sofficePath . '"' 
                : $sofficePath;
            
            // Tambahkan flag untuk mencegah LibreOffice hang (menunggu input user di background)
            $command = "{$executable} --headless --nologo --nofirststartwizard --norestore --convert-to pdf --outdir " . escapeshellarg($tempPdfDir) . " " . escapeshellarg($tempDocxPath) . " 2>&1";
            exec($command, $output, $returnVar);

            if ($returnVar !== 0) {
                throw new \Exception("LibreOffice conversion failed.\nCommand: {$command}\nOutput: " . implode("\n", $output));
            }

            $tempPdfPath = $tempPdfDir . DIRECTORY_SEPARATOR . pathinfo($tempDocxPath, PATHINFO_FILENAME) . '.pdf';

            if (!file_exists($tempPdfPath)) {
                throw new \Exception("Generated PDF not found at {$tempPdfPath}.\nCommand Output: " . implode("\n", $output));
            }

            $fileName = 'documents/' . Str::uuid() . '.pdf';
            $stream = fopen($tempPdfPath, 'r');
            Storage::disk('s3')->put($fileName, $stream);
            fclose($stream);

            $this->document->update([
                'status' => StatusDocument::GENERATED,
                'current_url' => $fileName,
            ]);

            $recipientName = $this->document->student->name ?? $this->document->teacher->name ?? 'External';

            OutgoingMail::create([
                'document_id' => $this->document->id,
                'recipient_name' => $recipientName,
                'sent_at' => now(),
            ]);

            DocumentHistory::create([
                'document_id' => $this->document->id,
                'file_path' => $fileName,
                'version_name' => StatusDocument::GENERATED,
                'note' => "Generated successfully as PDF for {$recipientName}. Template: " . $template->name,
                'created_by' => $this->document->created_by,
                'created_at' => now(),
            ]);

        } catch (Throwable $e) {
            Log::error("Document Generation Job failed: " . $e->getMessage(), ['exception' => $e]);
            throw $e;
        } finally {
            // Ensure all temporary files are properly deleted
            if ($tempTemplatePath && file_exists($tempTemplatePath)) {
                @unlink($tempTemplatePath);
            }
            if ($tempDocxPath && file_exists($tempDocxPath)) {
                @unlink($tempDocxPath);
            }
            if ($tempPdfPath && file_exists($tempPdfPath)) {
                @unlink($tempPdfPath);
            }
        }
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
