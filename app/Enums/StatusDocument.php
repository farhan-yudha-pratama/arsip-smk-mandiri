<?php

namespace App\Enums;

enum StatusDocument: string
{
    case DRAFT = 'DRAFT';
    case PROCESSING = 'PROCESSING';
    case GENERATED = 'GENERATED';
    case SIGNED = 'SIGNED';
    case ARCHIVED = 'ARCHIVED';
    case FAILED = 'FAILED';
}
