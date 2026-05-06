<?php

$tableData = [
    [
        'T_no' => 1,
        'T_nama-siswa' => 'Ahmad',
        'T_kelas' => '10',
        'T_jurusan' => 'RPL'
    ],
    [
        'T_no' => 2,
        'T_nama-siswa' => 'Budi',
        'T_kelas' => '10',
        'T_jurusan' => 'RPL'
    ],
    [
        'T_no' => 3,
        'T_nama-siswa' => 'Cici',
        'T_kelas' => '10',
        'T_jurusan' => 'RPL'
    ]
];

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

// 3. Logika Rowspan Otomatis: Kosongkan nilai jika sama dengan baris sebelumnya
$processedTableData = [];
$prevKelas = null;
$prevJurusan = null;

foreach ($tableData as $row) {
    $currentRow = $row;
    
    $currentKelas = $row['T_kelas'] ?? null;
    $currentJurusan = $row['T_jurusan'] ?? null;

    // Visual merging: hanya tampilkan jika berubah
    if ($currentKelas === $prevKelas && $currentJurusan === $prevJurusan) {
        $currentRow['T_kelas'] = '';
        $currentRow['T_jurusan'] = '';
    } else {
        $prevKelas = $currentKelas;
        $prevJurusan = $currentJurusan;
    }
    
    $processedTableData[] = $currentRow;
}

print_r($processedTableData);
