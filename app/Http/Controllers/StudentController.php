<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $kelasOptions = Student::select('kelas')->distinct()->whereNotNull('kelas')->pluck('kelas');
        $periodeOptions = Student::select('periode')->distinct()->whereNotNull('periode')->pluck('periode');

        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');

        $students = Student::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($request->kelas, function ($query, $kelas) {
                $query->where('kelas', $kelas);
            })
            ->when($request->periode, function ($query, $periode) {
                $query->where('periode', $periode);
            })
            ->orderBy($sort, $order)
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('students/index', [
            'students' => $students,
            'filters' => $request->only(['search', 'kelas', 'periode', 'sort', 'order']),
            'kelasOptions' => $kelasOptions,
            'periodeOptions' => $periodeOptions,
        ]);
    }
}
