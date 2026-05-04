<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;

class DocumentTemplateService
{
    public function extractVariables(string $filePath): array
    {
        $templateProcessor = new TemplateProcessor($filePath);
        
        $templateProcessor->setMacroChars('{{', '}}');
        
        $variables = $templateProcessor->getVariables();
        
        $templateProcessor->setMacroChars('${', '}');
        
        return array_values(array_unique($variables));
    }
}
