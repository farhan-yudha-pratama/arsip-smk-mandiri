<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model NumberingCounter
 *
 * Tabel aggregate yang menyimpan counter global nomor surat per bulan+tahun.
 * Digunakan agar tidak perlu melakukan COUNT(*) ke seluruh tabel numbering_sequences
 * setiap kali ingin mengetahui nomor urut berikutnya.
 *
 * @property int $id
 * @property int $global_sequence  Nomor urut global terakhir untuk bulan+tahun ini
 * @property int $month            Bulan (1–12)
 * @property int $year             Tahun (contoh: 2026)
 */
class NumberingCounter extends Model
{
    use HasFactory;

    protected $table = 'numbering_counters';

    protected $fillable = [
        'global_sequence',
        'month',
        'year',
    ];

    protected $casts = [
        'global_sequence' => 'integer',
        'month'           => 'integer',
        'year'            => 'integer',
    ];
}
