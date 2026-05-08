<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryNumbering;

/**
 * Seeder ini mengisi tabel category_numbering dengan 17 jenis surat
 * sesuai standar SMK Mandiri.
 *
 * Format nomor surat: {urutan}/{kode}/{instansi}/{bulan-romawi}/{tahun}
 * Contoh: 100/K.02/SMK-M/X/2026
 */
class CategoryNumberingSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        $jenisSurat = [
            [
                'name_numbering_document' => 'Surat Keputusan',
                'letter_code'             => 'K.01',
                'abbreviation'            => 'SK',
                'description'             => 'Surat Keputusan resmi dari pimpinan sekolah',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Undangan',
                'letter_code'             => 'K.02',
                'abbreviation'            => 'SU',
                'description'             => 'Surat undangan untuk kegiatan sekolah',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Permohonan',
                'letter_code'             => 'K.03',
                'abbreviation'            => 'SPm',
                'description'             => 'Surat permohonan kepada pihak lain',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Pemberitahuan',
                'letter_code'             => 'K.04',
                'abbreviation'            => 'SPb',
                'description'             => 'Surat pemberitahuan kepada pihak terkait',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Peminjaman',
                'letter_code'             => 'K.05',
                'abbreviation'            => 'SPp',
                'description'             => 'Surat peminjaman fasilitas atau barang',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Pernyataan',
                'letter_code'             => 'K.06',
                'abbreviation'            => 'SPn',
                'description'             => 'Surat pernyataan resmi',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Mandat',
                'letter_code'             => 'K.07',
                'abbreviation'            => 'SM',
                'description'             => 'Surat pemberian mandat kepada pihak tertentu',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Tugas',
                'letter_code'             => 'K.08',
                'abbreviation'            => 'ST',
                'description'             => 'Surat penugasan kepada pegawai/guru',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Keterangan',
                'letter_code'             => 'K.09',
                'abbreviation'            => 'SKet',
                'description'             => 'Surat keterangan resmi dari sekolah',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Rekomendasi',
                'letter_code'             => 'K.10',
                'abbreviation'            => 'SR',
                'description'             => 'Surat rekomendasi dari pihak sekolah',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Balasan',
                'letter_code'             => 'K.11',
                'abbreviation'            => 'SB',
                'description'             => 'Surat balasan atas surat yang diterima',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Perintah Perjalanan Dinas',
                'letter_code'             => 'K.12',
                'abbreviation'            => 'SPPD',
                'description'             => 'Surat perintah untuk perjalanan dinas resmi',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Sertifikat',
                'letter_code'             => 'K.13',
                'abbreviation'            => 'SRT',
                'description'             => 'Sertifikat penghargaan atau keikutsertaan',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Perjanjian Kerja',
                'letter_code'             => 'K.14',
                'abbreviation'            => 'PK',
                'description'             => 'Surat perjanjian kerja dengan pihak terkait',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Pengantar',
                'letter_code'             => 'K.15',
                'abbreviation'            => 'SPeng',
                'description'             => 'Surat pengantar untuk berbagai keperluan',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Teguran',
                'letter_code'             => 'K.16',
                'abbreviation'            => 'STeg',
                'description'             => 'Surat teguran resmi kepada pihak bersangkutan',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
            [
                'name_numbering_document' => 'Surat Pertanggunggung Jawab Mutlak',
                'letter_code'             => 'K.17',
                'abbreviation'            => 'SPJM',
                'description'             => 'Surat pertanggungjawaban mutlak atas suatu kegiatan',
                'format_pattern'          => '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}',
            ],
        ];

        foreach ($jenisSurat as $data) {
            CategoryNumbering::updateOrCreate(
                ['letter_code' => $data['letter_code']],
                $data
            );
        }

        $this->command->info('✅ Berhasil mengisi ' . count($jenisSurat) . ' jenis surat ke tabel category_numbering.');
    }
}
