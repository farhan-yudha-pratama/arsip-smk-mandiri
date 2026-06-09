<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Enums\StatusDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveReportController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $typeFilter = $request->query('type', 'all');

        $documents = Document::with(['creator', 'incomingMail', 'outgoingMail'])
            ->where('status', StatusDocument::ARCHIVED)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                      ->orWhere('recipient_name', 'like', '%' . $search . '%');
                });
            })
            ->when($typeFilter === 'incoming', function ($query) {
                $query->has('incomingMail');
            })
            ->when($typeFilter === 'outgoing', function ($query) {
                $query->doesntHave('incomingMail');
            })
            ->latest('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('reports/archive', [
            'documents' => $documents,
            'filters' => $request->only('search', 'type'),
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->query('type', 'all');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = Document::with(['creator', 'incomingMail', 'outgoingMail'])
            ->where('status', StatusDocument::ARCHIVED);

        if ($type === 'incoming') {
            $query->has('incomingMail');
        } elseif ($type === 'outgoing') {
            $query->doesntHave('incomingMail');
        }

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [
                \Carbon\Carbon::parse($startDate)->startOfDay(),
                \Carbon\Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $documents = $query->latest('created_at')->get();

        $html = view('reports.archive-pdf', [
            'documents' => $documents,
            'type' => $type,
            'startDate' => $startDate,
            'endDate' => $endDate
        ])->render();

        $options = new \Dompdf\Options();
        $options->set('defaultFont', 'Helvetica');
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        
        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        return response($dompdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="Laporan_Arsip_' . now()->format('YmdHis') . '.pdf"');
    }
}
