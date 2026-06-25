<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Headmaster extends Model
{
    protected $table = 'headmaster';
    protected $fillable = ['name'];
    public const UPDATED_AT = null;
}
