<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\NumberingCounter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentCounterController extends Controller
{
    public function index()
    {
        $year = now()->format('Y');
        
        // Ensure the counter exists for the current year
        $counter = NumberingCounter::firstOrCreate(
            ['month' => 1, 'year' => $year],
            ['global_sequence' => 0]
        );

        return Inertia::render('settings/document-counter', [
            'currentSequence' => $counter->global_sequence,
            'currentYear' => $year,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sequence' => 'required|integer|min:0',
        ]);

        $year = now()->format('Y');
        
        $counter = NumberingCounter::firstOrCreate(
            ['month' => 1, 'year' => $year],
            ['global_sequence' => 0]
        );

        $counter->update([
            'global_sequence' => $request->sequence,
        ]);

        return back()->with('success', 'Nomor awal surat berhasil diperbarui!');
    }
}
