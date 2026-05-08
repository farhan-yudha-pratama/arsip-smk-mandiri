<?php

namespace App\Services;

use App\Models\CategoryNumbering;
use App\Models\Document;
use App\Models\NumberingCounter;
use App\Models\NumberingSequence;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class DocumentNumberingService
{
    private const NAMA_INSTANSI = 'SMK-M';

    private const ROMAWI = [
        1  => 'I',
        2  => 'II',
        3  => 'III',
        4  => 'IV',
        5  => 'V',
        6  => 'VI',
        7  => 'VII',
        8  => 'VIII',
        9  => 'IX',
        10 => 'X',
        11 => 'XI',
        12 => 'XII',
    ];

    public function generateNomorSurat(Document $document, CategoryNumbering $kategori): string
    {
        return DB::transaction(function () use ($document, $kategori) {
            $sekarang = now();
            $bulan    = (int) $sekarang->format('n');
            $tahun    = (int) $sekarang->format('Y');

            $counter = NumberingCounter::lockForUpdate()
                ->firstOrCreate(
                    ['month' => $bulan, 'year' => $tahun],
                    ['global_sequence' => 0]
                );

            $counter->increment('global_sequence');
            $counter->refresh();

            $nomorUrut = $counter->global_sequence;

            $nomorSurat = $this->bangunNomorSurat(
                formatPattern: $kategori->format_pattern,
                nomorUrut:     $nomorUrut,
                kode:          $kategori->letter_code,
                bulan:         $bulan,
                tahun:         $tahun,
            );

            NumberingSequence::create([
                'category_numbering_id' => $kategori->id,
                'sequence_number'       => $nomorUrut,
                'month'                 => $bulan,
                'year'                  => $tahun,
                'document_number'       => $nomorSurat,
                'document_id'           => $document->id,
            ]);

            return $nomorSurat;
        });
    }

    private function bangunNomorSurat(
        string $formatPattern,
        int    $nomorUrut,
        string $kode,
        int    $bulan,
        int    $tahun,
    ): string {
        $bulanRomawi = self::ROMAWI[$bulan] ?? throw new RuntimeException(
            "Bulan tidak valid: {$bulan}. Nilai yang diizinkan: 1–12."
        );

        $peta = [
            '{nomor_urut}'   => (string) $nomorUrut,
            '{kode}'         => $kode,
            '{instansi}'     => self::NAMA_INSTANSI,
            '{bulan_romawi}' => $bulanRomawi,
            '{tahun}'        => (string) $tahun,
        ];

        $placeholderDitemukan = [];
        preg_match_all('/\{[^}]+\}/', $formatPattern, $placeholderDitemukan);

        $tidakDikenal = array_diff($placeholderDitemukan[0], array_keys($peta));
        if (!empty($tidakDikenal)) {
            throw new RuntimeException(
                'Format pattern mengandung placeholder tidak dikenal: ' . implode(', ', $tidakDikenal) .
                '. Placeholder yang didukung: ' . implode(', ', array_keys($peta))
            );
        }

        return str_replace(array_keys($peta), array_values($peta), $formatPattern);
    }

    public function ambilKategori(string $letterCode): CategoryNumbering
    {
        $kategori = CategoryNumbering::where('letter_code', $letterCode)->first();

        if (! $kategori) {
            throw new RuntimeException(
                "Kode surat '{$letterCode}' tidak ditemukan. " .
                'Pastikan data category_numbering sudah diisi dengan benar.'
            );
        }

        return $kategori;
    }

    public function semuaKategori()
    {
        return CategoryNumbering::orderBy('letter_code')->get();
    }
}
