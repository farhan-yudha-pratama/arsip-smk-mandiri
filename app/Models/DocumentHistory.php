<?php

namespace App\Models;

use App\Enums\StatusDocument;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentHistory extends Model
{
    use HasFactory;

    protected $table = 'document_history';
    public $timestamps = false;
    
    protected $guarded = [];

    protected $casts = [
        'version_name' => StatusDocument::class,
        'created_at' => 'datetime',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
