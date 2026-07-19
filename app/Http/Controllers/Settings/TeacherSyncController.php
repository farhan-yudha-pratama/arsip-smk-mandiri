<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TeacherSyncController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'teachers' => 'required|array',
        ]);

        $teachers = $request->input('teachers');

        foreach ($teachers as $teacherData) {
            if (isset($teacherData['nama_lengkap'])) {
                $nip = $teacherData['nip'] ?? 'NIP-' . strtoupper(Str::random(8));

                $teacher = Teacher::where('nip', $nip)->first();

                if ($teacher) {
                    // Jika guru dengan NIP tersebut sudah ada, update datanya
                    $teacher->update([
                        'name' => $teacherData['nama_lengkap']
                    ]);
                } else {
                    // Jika guru belum ada di database, buat data baru
                    Teacher::create([
                        'nip' => $nip,
                        'name' => $teacherData['nama_lengkap']
                    ]);
                }
            }
        }

        return response()->json(['success' => true]);
    }
}
