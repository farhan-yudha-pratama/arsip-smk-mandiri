<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryNumbering extends Model
{
    use HasFactory;

    protected $table = 'category_numbering';
    protected $guarded = [];
}
