<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;

class DocumentTemplateService
{
    /**
     * Extract variables from a DOCX template that use the {{variable}} format.
     * 
     * @param string $filePath
     * @return array
     */
    public function extractVariables(string $filePath): array
    {
        $templateProcessor = new TemplateProcessor($filePath);
        
        // Set the macro characters to {{ and }} to match our format
        $templateProcessor->setMacroChars('{{', '}}');
        
        $variables = $templateProcessor->getVariables();
        
        // Reset to default
        $templateProcessor->setMacroChars('${', '}');
        
        return array_values(array_unique($variables));
    }
}
