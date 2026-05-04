<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model NumberingSequence
 *
 * Menyimpan setiap nomor surat yang pernah diterbitkan.
 * Satu baris = satu nomor surat yang digunakan.
 *
 * @property int    $id
 * @property int    $category_numbering_id   ID kategori surat
 * @property int    $sequence_number         Nomor urut global (naik terus tidak reset)
 * @property int    $month                   Bulan pembuatan surat (1–12)
 * @property int    $year                    Tahun pembuatan surat
 * @property string $document_number         Nomor surat lengkap yang dihasilkan
 * @property string|null $document_id        UUID dokumen terkait
 */
class NumberingSequence extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_numbering_id',
        'sequence_number',
        'month',
        'year',
        'document_number',
        'document_id',
    ];

    protected $casts = [
        'sequence_number' => 'integer',
        'month'           => 'integer',
        'year'            => 'integer',
    ];

    /**
     * Kategori surat yang menghasilkan nomor ini.
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(CategoryNumbering::class, 'category_numbering_id');
    }

    /**
     * Dokumen terkait dengan nomor surat ini.
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
