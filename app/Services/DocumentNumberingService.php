<?php

namespace App\Services;

use App\Models\CategoryNumbering;
use App\Models\Document;
use App\Models\NumberingCounter;
use App\Models\NumberingSequence;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * DocumentNumberingService
 *
 * Bertanggung jawab untuk menghasilkan nomor surat unik berdasarkan format:
 *   {nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}
 *
 * Contoh: 100/K.02/SMK-M/X/2026
 *
 * Proses ini dilakukan dalam transaksi database dengan PESSIMISTIC LOCK
 * agar tidak terjadi duplikasi nomor surat saat proses paralel.
 */
class DocumentNumberingService
{
    /**
     * Nama instansi yang akan muncul di nomor surat.
     */
    private const NAMA_INSTANSI = 'SMK-M';

    /**
     * Pemetaan angka ke angka romawi.
     */
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

    /**
     * Generate nomor surat baru dan simpan ke database.
     *
     * @param  Document          $document        Dokumen yang akan diberi nomor surat.
     * @param  CategoryNumbering $kategori        Kategori/jenis surat.
     * @return string                             Nomor surat yang dihasilkan.
     *
     * @throws RuntimeException  Jika kategori tidak valid atau format tidak dikenali.
     */
    public function generateNomorSurat(Document $document, CategoryNumbering $kategori): string
    {
        return DB::transaction(function () use ($document, $kategori) {
            $sekarang = now();
            $bulan    = (int) $sekarang->format('n');
            $tahun    = (int) $sekarang->format('Y');

            // ── 1. Ambil & increment counter global (aggregate) ──────────────
            $counter = NumberingCounter::lockForUpdate()
                ->firstOrCreate(
                    ['month' => $bulan, 'year' => $tahun],
                    ['global_sequence' => 0]
                );

            $counter->increment('global_sequence');
            $counter->refresh();

            $nomorUrut = $counter->global_sequence;

            // ── 2. Bangun nomor surat dari format pattern ────────────────────
            $nomorSurat = $this->bangunNomorSurat(
                formatPattern: $kategori->format_pattern,
                nomorUrut:     $nomorUrut,
                kode:          $kategori->letter_code,
                bulan:         $bulan,
                tahun:         $tahun,
            );

            Log::info('DocumentNumberingService: Nomor surat dihasilkan', [
                'document_id'    => $document->id,
                'nomor_surat'    => $nomorSurat,
                'kategori'       => $kategori->name_numbering_document,
                'nomor_urut'     => $nomorUrut,
                'bulan'          => $bulan,
                'tahun'          => $tahun,
            ]);

            // ── 3. Simpan ke numbering_sequences ────────────────────────────
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

    /**
     * Bangun string nomor surat berdasarkan format pattern.
     *
     * Placeholder yang didukung:
     *   {nomor_urut}    → Nomor urut global (integer)
     *   {kode}          → Kode jenis surat, contoh: K.02
     *   {instansi}      → Nama instansi, contoh: SMK-M
     *   {bulan_romawi}  → Bulan dalam angka romawi, contoh: X
     *   {tahun}         → Tahun 4 digit, contoh: 2026
     *
     * @throws RuntimeException Jika format pattern mengandung placeholder tidak dikenal.
     */
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

        // Validasi: pastikan semua placeholder dikenal
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

    /**
     * Ambil kategori surat berdasarkan letter_code.
     *
     * @param  string $letterCode  Kode surat, contoh: K.02
     * @return CategoryNumbering
     *
     * @throws RuntimeException Jika kode surat tidak ditemukan di database.
     */
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

    /**
     * Ambil semua kategori surat yang tersedia.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, CategoryNumbering>
     */
    public function semuaKategori()
    {
        return CategoryNumbering::orderBy('letter_code')->get();
    }
}
