<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentSyncController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'students' => 'required|array',
        ]);

        $students = $request->input('students');

        foreach ($students as $studentData) {
            if (isset($studentData['nisn']) && isset($studentData['nis']) && isset($studentData['nama_lengkap'])) {
                Student::updateOrCreate(
                    ['nisn' => $studentData['nisn']],
                    [
                        'nis' => $studentData['nis'],
                        'name' => $studentData['nama_lengkap'],
                    ]
                );
            }
        }

        return response()->json(['success' => true]);
    }
}
