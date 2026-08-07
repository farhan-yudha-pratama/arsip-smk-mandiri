<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $kelasOptions = Student::select('kelas')
            ->distinct()
            ->whereNotNull('kelas')
            ->pluck('kelas')
            ->sort(function ($a, $b) {
                $getSortableArray = function($kelas) {
                    if (preg_match('/^(XIII|XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)(?:\s+|-|_)?(.*)$/i', trim($kelas), $matches)) {
                        $map = [
                            'I' => 1, 'II' => 2, 'III' => 3, 'IV' => 4, 'V' => 5, 
                            'VI' => 6, 'VII' => 7, 'VIII' => 8, 'IX' => 9, 
                            'X' => 10, 'XI' => 11, 'XII' => 12, 'XIII' => 13
                        ];
                        $grade = $map[strtoupper($matches[1])] ?? 99;
                        return [$grade, trim($matches[2])];
                    }
                    return [99, trim($kelas)];
                };

                $arrA = $getSortableArray($a);
                $arrB = $getSortableArray($b);
                
                if ($arrA[0] === $arrB[0]) {
                    return strnatcasecmp($arrA[1], $arrB[1]);
                }
                return $arrA[0] <=> $arrB[0];
            })
            ->values();

        $periodeOptions = Student::select('periode')->distinct()->whereNotNull('periode')->orderBy('periode', 'desc')->pluck('periode');

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
