<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use App\Enums\StatusDocument;
use App\Models\Document;
use App\Models\DocumentHistory;
use App\Notifications\DocumentGenerationFailedNotification;
use App\Services\DocumentNumberingService;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\TemplateProcessor;
use App\Models\OutgoingMail;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class GenerateDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $document;
    protected $metaDataValues;

    protected ?int $categoryNumberingId;

    /**
     * Buat instance job baru.
     *
     * @param Document   $document           Dokumen yang akan di-generate.
     * @param array      $metaDataValues     Nilai placeholder template.
     * @param int|null   $categoryNumberingId ID kategori surat untuk penomoran.
     */
    public function __construct(
        Document $document,
        array $metaDataValues,
        ?int $categoryNumberingId = null,
    ) {
        $this->document            = $document;
        $this->metaDataValues      = $metaDataValues;
        $this->categoryNumberingId = $categoryNumberingId;
    }

    /**
     * Execute the job.
     */
    public function handle(\App\Contracts\StorageServiceInterface $storageService): void
    {
        ini_set('memory_limit', '512M');

        $template = $this->document->template;
        
        $tempTemplatePath = '';
        $tempDocxPath = '';
        $tempPdfPath = '';

        try {
            $nomorSurat = null;
            if ($this->categoryNumberingId) {
                try {
                    $numberingService = app(DocumentNumberingService::class);
                    $kategori         = $numberingService->ambilKategori(
                        \App\Models\CategoryNumbering::findOrFail($this->categoryNumberingId)->letter_code
                    );
                    $nomorSurat = $numberingService->generateNomorSurat($this->document, $kategori);

                    $this->metaDataValues['nomor-surat'] = $nomorSurat;

                } catch (RuntimeException $e) {
                    Log::warning('GenerateDocumentJob: Penomoran surat gagal — ' . $e->getMessage(), [
                        'document_id'          => $this->document->id,
                        'category_numbering_id' => $this->categoryNumberingId,
                    ]);
                }
            }

            $templateContent = $storageService->get($template->url);
            if (!$templateContent) {
                throw new \Exception("Template file not found: " . $template->url);
            }
            $tempTemplatePath = tempnam(sys_get_temp_dir(), 'tpl');
            file_put_contents($tempTemplatePath, $templateContent);

            // Clean internal XML tags within placeholders
            app(\App\Services\DocumentTemplateService::class)->cleanTemplateMarkup($tempTemplatePath);

            $templateProcessor = new TemplateProcessor($tempTemplatePath);

            $templateProcessor->setMacroChars('{{', '}}');
            
            // Separate scalar values and table data
            $scalarData = [];
            $tableData = [];
            $tableKey = null;

            foreach ($this->metaDataValues as $key => $value) {
                if (is_array($value)) {
                    $tableData = $value;
                    $tableKey = $key; // Typically 'T_table_data'
                } else {
                    $scalarData[$key] = $value;
                }
            }

            // Fill global/scalar variables
            foreach ($scalarData as $key => $value) {
                $templateProcessor->setValue($key, $value);
            }

            // Handle Dynamic Table if exists
            if (!empty($tableData)) {
                // Determine the first placeholder in the row to use for cloning
                $firstRow = $tableData[0];
                $cloneKey = null;
                
                // Prioritize T_nama-siswa or T_nama or first T_ key
                $priorities = ['T_nama-siswa', 'T_nama', 'T_no'];
                foreach ($priorities as $p) {
                    if (array_key_exists($p, $firstRow)) {
                        $cloneKey = $p;
                        break;
                    }
                }

                if (!$cloneKey) {
                    foreach ($firstRow as $key => $val) {
                        if (strpos($key, 'T_') === 0) {
                            $cloneKey = $key;
                            break;
                        }
                    }
                }

                if ($cloneKey) {
                    // 1. URUTKAN DATA: Kelas (Kecil ke Besar), lalu Jurusan (A ke Z)
                    usort($tableData, function ($a, $b) {
                        // Ambil angka saja dari string kelas (misal "Kelas 10" -> 10)
                        $kelasA = (int) preg_replace('/[^0-9]/', '', $a['T_kelas'] ?? '0');
                        $kelasB = (int) preg_replace('/[^0-9]/', '', $b['T_kelas'] ?? '0');
                        
                        if ($kelasA !== $kelasB) {
                            return $kelasA <=> $kelasB;
                        }
                        
                        // Urutkan berdasarkan Jurusan (Abjad)
                        return strcasecmp($a['T_jurusan'] ?? '', $b['T_jurusan'] ?? '');
                    });

                    // 2. Re-sequence T_no setelah pengurutan
                    foreach ($tableData as $index => &$row) {
                        $row['T_no'] = $index + 1;
                    }
                    unset($row);

                    $templateProcessor->cloneRowAndSetValues($cloneKey, $tableData);
                }
            }

            $templateProcessor->setMacroChars('${', '}');

            $tempDocxPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . uniqid('doc_') . '.docx';
            $templateProcessor->saveAs($tempDocxPath);

            $tempPdfDir = sys_get_temp_dir();
            $sofficePath = env('LIBREOFFICE_PATH');

            if (!$sofficePath) {
                if (app()->environment('local')) {
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
                } elseif (app()->environment('staging')) {
                    $sofficePath = 'soffice';
                }
                
                if (!$sofficePath) {
                    $sofficePath = 'soffice';
                }
            }

            $executable = (strpos($sofficePath, ' ') !== false && strpos($sofficePath, '"') === false) 
                ? '"' . $sofficePath . '"' 
                : $sofficePath;
            
            $command = "{$executable} --headless --nologo --nofirststartwizard --norestore --convert-to pdf --outdir " . escapeshellarg($tempPdfDir) . " " . escapeshellarg($tempDocxPath) . " 2>&1";
            exec($command, $output, $returnVar);

            if ($returnVar !== 0) {
                throw new \Exception("LibreOffice conversion failed.\nCommand: {$command}\nOutput: " . implode("\n", $output));
            }

            $tempPdfPath = $tempPdfDir . DIRECTORY_SEPARATOR . pathinfo($tempDocxPath, PATHINFO_FILENAME) . '.pdf';

            if (!file_exists($tempPdfPath)) {
                throw new \Exception("Generated PDF not found at {$tempPdfPath}.\nCommand Output: " . implode("\n", $output));
            }

            $fileName = $storageService->uploadFile($tempPdfPath, 'documents', 'document');

            $updatePayload = [
                'status'      => StatusDocument::GENERATED,
                'current_url' => $fileName,
            ];

            if ($nomorSurat !== null) {
                $updatePayload['document_number'] = $nomorSurat;
            }

            $this->document->update($updatePayload);

            $recipientName = $this->document->recipient_name;

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
            if ($tempTemplatePath && file_exists($tempTemplatePath)) @unlink($tempTemplatePath);
            if ($tempDocxPath && file_exists($tempDocxPath)) @unlink($tempDocxPath);
            if ($tempPdfPath && file_exists($tempPdfPath)) @unlink($tempPdfPath);
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

        $this->document->creator->notify(new DocumentGenerationFailedNotification($this->document, $exception->getMessage()));
    }
}