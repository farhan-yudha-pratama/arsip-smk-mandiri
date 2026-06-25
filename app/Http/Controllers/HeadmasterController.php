<?php

namespace App\Http\Controllers;

use App\Models\Headmaster;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HeadmasterController extends Controller
{
    public function index()
    {
        $headmaster = Headmaster::first();
        return Inertia::render('headmaster/index', [
            'headmaster' => $headmaster
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $headmaster = Headmaster::first();
        
        if ($headmaster) {
            $headmaster->update(['name' => $request->name]);
            return back()->with('success', 'Nama Kepala Sekolah berhasil diperbarui!');
        } else {
            Headmaster::create(['name' => $request->name]);
            return back()->with('success', 'Nama Kepala Sekolah berhasil disimpan!');
        }
    }
}
