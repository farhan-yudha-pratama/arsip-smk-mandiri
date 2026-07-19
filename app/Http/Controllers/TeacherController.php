<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');

        $teachers = Teacher::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nip', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort, $order)
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('teachers/index', [
            'teachers' => $teachers,
            'filters' => $request->only(['search', 'sort', 'order']),
        ]);
    }
}
