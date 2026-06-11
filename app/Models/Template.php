<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory, HasUuids;

    /**
     * Nama tabel jika berbeda dengan jamak nama model (opsional).
     */
    protected $table = 'templates';

    /**
     * Kolom yang dapat diisi secara massal.
     */
    protected $fillable = [
        'name',
        'url',
        'meta_data',
    ];

    protected $appends = ['full_url'];

    /**
     * Mendefinisikan konversi tipe data (Casting).
     * Menggunakan method casts() memberikan fleksibilitas lebih pada Laravel 10/11+.
     */
    protected function casts(): array
    {
        return [
            'meta_data' => 'array',
            'id' => 'string',
        ];
    }

    public function getFullUrlAttribute(): ?string
    {
        if (!$this->url) {
            return null;
        }

        $diskName = env('FILESYSTEM_DISK', 's3');
        if ($diskName === 'local') {
            $diskName = 'public';
        }

        return \Illuminate\Support\Facades\Storage::disk($diskName)->url($this->url);
    }
}