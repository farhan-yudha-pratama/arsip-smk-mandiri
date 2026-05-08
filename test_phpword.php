<?php
require 'vendor/autoload.php';

$phpWord = new \PhpOffice\PhpWord\PhpWord();
$section = $phpWord->addSection();
$table = $section->addTable();
$table->addRow();
$table->addCell(2000)->addText('${T_no}');
$table->addCell(2000)->addText('${T_nama}');
$table->addCell(2000)->addText('${T_kelas}');
$table->addCell(2000)->addText('${T_jurusan}');

$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
$objWriter->save('test_template.docx');

$templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('test_template.docx');

$tableData = [
    [ 'T_no' => 1, 'T_nama' => 'A', 'T_kelas' => '10', 'T_jurusan' => 'RPL' ],
    [ 'T_no' => 2, 'T_nama' => 'B', 'T_kelas' => '', 'T_jurusan' => '' ],
    [ 'T_no' => 3, 'T_nama' => 'C', 'T_kelas' => '', 'T_jurusan' => '' ],
];

$templateProcessor->cloneRowAndSetValues('T_kelas', $tableData);
$templateProcessor->saveAs('test_output.docx');

// Check test_output.docx contents
$zip = new ZipArchive();
if ($zip->open('test_output.docx') === TRUE) {
    $xml = $zip->getFromName('word/document.xml');
    echo substr_count($xml, '<w:tr ') . " rows generated.\n";
    echo $xml;
    $zip->close();
} else {
    echo "Failed to open test_output.docx";
}
