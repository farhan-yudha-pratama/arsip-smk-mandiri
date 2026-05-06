<?php
$zip = new \ZipArchive();
if ($zip->open('test_merge.docx') === true) {
    $xmlString = $zip->getFromName('word/document.xml');
    
    $dom = new \DOMDocument();
    $dom->preserveWhiteSpace = true;
    $dom->loadXML($xmlString);
    $xpath = new \DOMXPath($dom);
    $xpath->registerNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
    
    $cells = $xpath->query('//w:tc');
    foreach ($cells as $cell) {
        $texts = $xpath->query('.//w:t', $cell);
        $vMergeVal = null;
        
        foreach ($texts as $t) {
            if (strpos($t->nodeValue, '@@VRESTART@@') !== false) {
                $vMergeVal = 'restart';
                $t->nodeValue = str_replace('@@VRESTART@@', '', $t->nodeValue);
            } elseif (strpos($t->nodeValue, '@@VCONTINUE@@') !== false) {
                $vMergeVal = 'continue';
                $t->nodeValue = str_replace('@@VCONTINUE@@', '', $t->nodeValue);
            }
        }
        
        if ($vMergeVal) {
            $tcPr = $xpath->query('./w:tcPr', $cell)->item(0);
            if (!$tcPr) {
                $tcPr = $dom->createElement('w:tcPr');
                $cell->insertBefore($tcPr, $cell->firstChild);
            }
            
            $existingVMerge = $xpath->query('./w:vMerge', $tcPr)->item(0);
            if ($existingVMerge) {
                $tcPr->removeChild($existingVMerge);
            }
            
            $vMerge = $dom->createElement('w:vMerge');
            $vMerge->setAttribute('w:val', $vMergeVal);
            $tcPr->appendChild($vMerge);
        }
    }
    
    $zip->addFromString('word/document.xml', $dom->saveXML());
    $zip->close();
    echo "Done modification with preserveWhiteSpace.\n";
} else {
    echo "Failed to open zip.\n";
}
