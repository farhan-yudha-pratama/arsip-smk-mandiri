<?php

namespace App\Enums;

enum RoleType: string
{
    case SUPERADMIN = 'SUPERADMIN';
    case ADMIN = 'ADMIN';
    case OPERATOR = 'OPERATOR';
}
