<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            ['name' => 'Aditya Pratama', 'nis' => '12345001', 'nisn' => '0012345001'],
            ['name' => 'Budi Santoso', 'nis' => '12345002', 'nisn' => '0012345002'],
            ['name' => 'Citra Lestari', 'nis' => '12345003', 'nisn' => '0012345003'],
            ['name' => 'Dina Amalia', 'nis' => '12345004', 'nisn' => '0012345004'],
            ['name' => 'Eko Wahyudi', 'nis' => '12345005', 'nisn' => '0012345005'],
        ];

        foreach ($students as $student) {
            Student::updateOrCreate(['nis' => $student['nis']], $student);
        }
    }
}
