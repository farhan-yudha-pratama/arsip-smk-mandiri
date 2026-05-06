<?php
require 'vendor/autoload.php';
$phpWord = new \PhpOffice\PhpWord\PhpWord();
$section = $phpWord->addSection();
$table = $section->addTable();
$table->addRow();
$table->addCell()->addText('@@VRESTART@@Kelas 10');
$table->addCell()->addText('@@VRESTART@@RPL');
$table->addRow();
$table->addCell()->addText('@@VCONTINUE@@');
$table->addCell()->addText('@@VCONTINUE@@');
$writer = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
$writer->save('test_merge.docx');