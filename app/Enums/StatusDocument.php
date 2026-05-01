<?php

namespace App\Enums;

enum StatusDocument: string
{
    case DRAFT = 'DRAFT';
    case GENERATED = 'GENERATED';
    case SIGNED = 'SIGNED';
    case ARCHIVED = 'ARCHIVED';
}
