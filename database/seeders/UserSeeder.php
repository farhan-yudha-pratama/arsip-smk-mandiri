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

        $superadmin1 = User::create([
            'email' => 'agungdani0309@gmail.com',
            'name' => 'Agung Dani',
            'password' => Hash::make('password'),
            'is_active' => true,
            ],
        );
        $superadmin->assignRole(RoleType::SUPERADMIN->value);

        $superadmin2 = User::create([
            'email' => 'farhan.yudha2016we@gmail.com',
            'name' => 'Farhan Yudha Pratama',
            'password' => Hash::make('password'),
            'is_active' => true,
            ],
        );
        $superadmin2->assignRole(RoleType::SUPERADMIN->value);
    }
}
