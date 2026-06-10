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

                Teacher::updateOrCreate(
                    ['nip' => $nip],
                    ['name' => $teacherData['nama_lengkap']]
                );
            }
        }

        return response()->json(['success' => true]);
    }
}
