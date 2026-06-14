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
            'password' => Hash::make('4IpbT0g&g$p$oZ!g')
            ],
        );
        $superadmin1->assignRole(RoleType::SUPERADMIN->value);

        $superadmin2 = User::create([
            'email' => 'farhan.yudha2016we@gmail.com',
            'name' => 'Farhan Yudha Pratama',
            'password' => Hash::make('3URI:39LRxfvrY*k')
            ],
        );
        $superadmin2->assignRole(RoleType::SUPERADMIN->value);
    }
}
