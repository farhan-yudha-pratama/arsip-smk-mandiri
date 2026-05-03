<?php

namespace Database\Seeders;

use App\Models\Teacher;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = [
            ['name' => 'Bapak Ahmad', 'nip' => '198001012005011001'],
            ['name' => 'Ibu Siti', 'nip' => '198505122010012002'],
            ['name' => 'Bapak Bambang', 'nip' => '197503152000031003'],
            ['name' => 'Ibu Maria', 'nip' => '199008202015012004'],
            ['name' => 'Bapak Rizky', 'nip' => '199212252018011005'],
        ];

        foreach ($teachers as $teacher) {
            Teacher::updateOrCreate(['nip' => $teacher['nip']], $teacher);
        }
    }
}
