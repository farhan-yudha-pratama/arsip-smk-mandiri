<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration ini melakukan tiga hal:
 * 1. Menambah kolom `letter_code` dan `description` ke tabel category_numbering
 * 2. Merestrukturisasi tabel numbering_sequences agar sesuai format penomoran surat
 * 3. Membuat tabel numbering_counters sebagai aggregate counter per kategori+bulan+tahun
 */
return new class extends Migration
{
    /**
     * Jalankan migration.
     */
    public function up(): void
    {
        // ── 1. Tambah kolom ke category_numbering ──────────────────────────────
        Schema::table('category_numbering', function (Blueprint $table) {
            // Kode jenis surat, contoh: K.01, K.02, dsb.
            $table->string('letter_code', 10)->unique()->after('name_numbering_document');

            // Singkatan jenis surat, contoh: SK, SU, SPm, dsb.
            $table->string('abbreviation', 20)->after('letter_code');

            // Deskripsi panjang jenis surat (opsional)
            $table->string('description')->nullable()->after('abbreviation');
        });

        // ── 2. Restrukturisasi numbering_sequences ──────────────────────────────
        //    Tabel ini menyimpan setiap nomor surat yang pernah dibuat.
        //    Satu baris = satu nomor surat yang digunakan.
        Schema::table('numbering_sequences', function (Blueprint $table) {
            // Hapus constraint unique lama
            $table->dropUnique(['category_numbering_id', 'year']);
        });

        Schema::table('numbering_sequences', function (Blueprint $table) {
            // Hapus kolom last_number karena tabel ini sekarang per-record
            $table->dropColumn(['year', 'last_number']);
        });

        Schema::table('numbering_sequences', function (Blueprint $table) {
            // Nomor urut surat (global, bertambah 1 setiap surat apapun jenisnya)
            $table->unsignedBigInteger('sequence_number')->after('category_numbering_id');

            // Bulan surat dibuat (1–12)
            $table->unsignedTinyInteger('month')->after('sequence_number');

            // Tahun surat dibuat (contoh: 2026)
            $table->unsignedSmallInteger('year')->after('month');

            // Nomor surat lengkap yang dihasilkan, disimpan untuk referensi cepat
            $table->string('document_number')->unique()->after('year');

            // Relasi ke dokumen terkait
            $table->foreignUuid('document_id')
                ->nullable()
                ->constrained('documents')
                ->nullOnDelete()
                ->after('document_number');

            $table->timestamps();

            // Index untuk mempercepat pencarian berdasarkan tahun & bulan
            $table->index(['year', 'month']);
            $table->index('sequence_number');
        });

        // ── 3. Buat tabel numbering_counters (aggregate) ────────────────────────
        //    Tabel ini menyimpan counter terakhir per kategori + bulan + tahun
        //    sehingga tidak perlu COUNT(*) ke seluruh numbering_sequences.
        Schema::create('numbering_counters', function (Blueprint $table) {
            $table->id();

            // Counter global untuk semua surat (global_counter bertambah setiap surat dibuat)
            // Ini counter GLOBAL — tidak per-kategori
            $table->unsignedBigInteger('global_sequence')->default(0);

            // Bulan dan tahun dari counter ini
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');

            $table->timestamps();

            // Setiap kombinasi bulan+tahun hanya ada satu baris
            $table->unique(['month', 'year']);
            $table->index('year');
        });
    }

    /**
     * Kembalikan migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('numbering_counters');

        Schema::table('numbering_sequences', function (Blueprint $table) {
            $table->dropForeign(['document_id']);
            $table->dropIndex(['year', 'month']);
            $table->dropIndex(['sequence_number']);
            $table->dropColumn(['sequence_number', 'month', 'year', 'document_number', 'document_id', 'created_at', 'updated_at']);
        });

        Schema::table('numbering_sequences', function (Blueprint $table) {
            $table->integer('year')->after('category_numbering_id');
            $table->integer('last_number')->default(0)->after('year');
            $table->unique(['category_numbering_id', 'year']);
        });

        Schema::table('category_numbering', function (Blueprint $table) {
            $table->dropUnique(['letter_code']);
            $table->dropColumn(['letter_code', 'abbreviation', 'description']);
        });
    }
};
