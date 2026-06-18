<?php

namespace Database\Seeders;

use App\Enums\RoleType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (RoleType::cases() as $role) {
            Role::firstOrCreate(['name' => $role->value]);
        }

        $superadmin = User::create([
            'email' => 'superadmin@example.com',
            'name' => 'Super Administrator',
            'password' => Hash::make('password'),
            'is_active' => true,
            ],
        );
        $superadmin1->assignRole(RoleType::SUPERADMIN->value);

        $admin = User::create([
            'email' => 'admin@example.com',
            'name' => 'Administrator',
            'password' => Hash::make('password'),
            'is_active' => true,
            ],
        );
        $admin->assignRole(RoleType::ADMIN->value);

        $operator = User::create([
            'email' => 'operator@example.com',
            'name' => 'Operator',
            'password' => Hash::make('password'),
            'is_active' => true,
            ],
        );
        $operator->assignRole(RoleType::OPERATOR->value);
    }
}
