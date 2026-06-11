<?php

namespace App\Models;

use App\Enums\RecipientType;
use App\Enums\StatusDocument;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];
    protected $fillable = [
        'template_id',
        'document_number',
        'title',
        'status',
        'recipient_type',
        'recipient_name',
        'meta_data_values',
        'current_url',
        'is_batch',
        'created_by'
    ];
    protected $with = ['students', 'teachers'];
    protected $withCount = ['students', 'teachers'];
    protected $appends = ['full_url'];

    protected $casts = [
        'status' => StatusDocument::class,
        'recipient_type' => RecipientType::class,
        'meta_data_values' => 'array',
        'is_batch' => 'boolean',
    ];

    public function getRecipientNameAttribute(): string
    {
        if ($this->recipient_type === RecipientType::EXTERNAL) {
            return $this->attributes['recipient_name'] ?? 'External';
        }

        $firstRecipient = $this->recipient_type === RecipientType::STUDENT
            ? $this->students->first()
            : $this->teachers->first();

        $name = $firstRecipient?->name ?? ($this->attributes['recipient_name'] ?? 'External');

        if ($this->is_batch) {
            $count = $this->recipient_type === RecipientType::STUDENT
                ? ($this->students_count ?? $this->students->count())
                : ($this->teachers_count ?? $this->teachers->count());

            if ($count > 1) {
                $name .= ' & ' . ($count - 1) . ' lainnya';
            }
        }

        return $name;
    }

    public function getFullUrlAttribute(): ?string
    {
        if (!$this->current_url) {
            return null;
        }

        $diskName = env('FILESYSTEM_DISK', 's3');
        if ($diskName === 'local') {
            $diskName = 'public';
        }

        return \Illuminate\Support\Facades\Storage::disk($diskName)->url($this->current_url);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'document_students');
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'document_teachers');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function history()
    {
        return $this->hasMany(DocumentHistory::class);
    }

    public function incomingMail()
    {
        return $this->hasOne(IncomingMail::class);
    }

    public function outgoingMail()
    {
        return $this->hasOne(OutgoingMail::class);
    }
}
