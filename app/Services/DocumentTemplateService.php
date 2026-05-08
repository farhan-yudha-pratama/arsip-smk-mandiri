<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;

class DocumentTemplateService
{
    public function extractVariables(string $filePath): array
    {
        $variables = [];
        $zip = new \ZipArchive();

        if ($zip->open($filePath) === true) {
            // Check document, headers, and footers
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $filename = $zip->getNameIndex($i);
                if (strpos($filename, 'word/') === 0 && strpos($filename, '.xml') !== false) {
                    $content = $zip->getFromIndex($i);
                    
                    // Pattern to match {{...}} or ${...} while ignoring internal XML tags
                    // This matches the start {{ or ${, then any sequence of XML tags or non-closing characters, until the end }} or }
                    
                    // Match {{...}}
                    if (preg_match_all('/\{\{(?:<[^>]+>|[^}])*\}\}/', $content, $matches)) {
                        foreach ($matches[0] as $match) {
                            // Strip XML tags and the outer braces
                            $clean = strip_tags($match);
                            $clean = str_replace(['{{', '}}'], '', $clean);
                            // Remove newlines, returns, tabs, and zero-width spaces
                            $clean = preg_replace('/[\r\n\t\x{200B}]+|(&#13;)|(&#10;)/u', '', $clean);
                            $variables[] = trim($clean);
                        }
                    }
                    
                    // Match ${...}
                    if (preg_match_all('/\$\{(?:<[^>]+>|[^}])*\}/', $content, $matches)) {
                        foreach ($matches[0] as $match) {
                            $clean = strip_tags($match);
                            $clean = str_replace(['${', '}'], '', $clean);
                            $clean = preg_replace('/[\r\n\t\x{200B}]+|(&#13;)|(&#10;)/u', '', $clean);
                            $variables[] = trim($clean);
                        }
                    }
                }
            }
            $zip->close();
        }

        return array_values(array_unique(array_filter($variables)));
    }

    public function cleanTemplateMarkup(string $filePath): void
    {
        $zip = new \ZipArchive();
        if ($zip->open($filePath) === true) {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $filename = $zip->getNameIndex($i);
                if (strpos($filename, 'word/') === 0 && strpos($filename, '.xml') !== false) {
                    $content = $zip->getFromIndex($i);
                    
                    $newContent = preg_replace_callback('/\{\{(?:<[^>]+>|[^}])*\}\}/', function($matches) {
                        $clean = strip_tags($matches[0]);
                        $clean = str_replace(['{{', '}}'], '', $clean);
                        $clean = preg_replace('/[\r\n\t\x{200B}]+|(&#13;)|(&#10;)/u', '', $clean);
                        return '{{' . trim($clean) . '}}';
                    }, $content);
                    
                    $newContent = preg_replace_callback('/\$\{(?:<[^>]+>|[^}])*\}/', function($matches) {
                        $clean = strip_tags($matches[0]);
                        $clean = str_replace(['${', '}'], '', $clean);
                        $clean = preg_replace('/[\r\n\t\x{200B}]+|(&#13;)|(&#10;)/u', '', $clean);
                        return '${' . trim($clean) . '}';
                    }, $newContent);

                    if ($newContent !== $content) {
                        $zip->addFromString($filename, $newContent);
                    }
                }
            }
            $zip->close();
        }
    }
}

