<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model CategoryNumbering
 *
 * Merepresentasikan jenis/kategori surat beserta kode dan format nomornya.
 *
 * @property int    $id
 * @property string $name_numbering_document  Nama lengkap jenis surat, contoh: "Surat Undangan"
 * @property string $letter_code              Kode unik jenis surat, contoh: "K.02"
 * @property string $abbreviation             Singkatan jenis surat, contoh: "SU"
 * @property string $description              Deskripsi singkat jenis surat (opsional)
 * @property string $format_pattern           Format nomor surat, contoh: "{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}"
 */
class CategoryNumbering extends Model
{
    use HasFactory;

    protected $table = 'category_numbering';

    protected $fillable = [
        'name_numbering_document',
        'letter_code',
        'abbreviation',
        'description',
        'format_pattern',
    ];

    /**
     * Semua nomor surat yang pernah diterbitkan untuk kategori ini.
     */
    public function sequences(): HasMany
    {
        return $this->hasMany(NumberingSequence::class);
    }
}
