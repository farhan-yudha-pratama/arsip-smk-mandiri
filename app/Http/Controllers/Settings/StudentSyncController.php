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
            if (isset($studentData['nis']) && isset($studentData['nama_siswa'])) {
                $nama_kelas = $studentData['nama_kelas'] ?? '';
                $kelas = $nama_kelas;
                $periode = $studentData['tahun_angkatan'] ?? null;

                // Extract kelas and periode from nama_kelas if needed
                // e.g., "XII PPLG 2 2025/2026"
                if (preg_match('/(.*?)\s+(\d{4}\/\d{4})$/', $nama_kelas, $matches)) {
                    $kelas = trim($matches[1]);
                    // Only use extracted period if tahun_angkatan is null/empty
                    if (empty($periode)) {
                        $periode = $matches[2];
                    }
                }

                Student::updateOrCreate(
                    ['nis' => $studentData['nis']],
                    [
                        'name' => $studentData['nama_siswa'],
                        'kelas' => $kelas,
                        'periode' => $periode,
                    ]
                );
            }
        }

        return response()->json(['success' => true]);
    }
}
