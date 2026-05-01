<?php

namespace App\Enums;

enum RecipientType: string
{
    case STUDENT = 'STUDENT';
    case TEACHER = 'TEACHER';
    case EXTERNAL = 'EXTERNAL';
}
