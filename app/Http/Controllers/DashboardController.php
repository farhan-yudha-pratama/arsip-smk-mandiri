<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $outgoingCount = \App\Models\Document::doesntHave('incomingMail')->count();
        $incomingCount = \App\Models\Document::has('incomingMail')->count();
        $templateCount = \App\Models\Template::count();

        $timelineRaw = \Illuminate\Support\Facades\DB::table('documents')
            ->select(
                \Illuminate\Support\Facades\DB::raw('DATE(created_at) as date'),
                \Illuminate\Support\Facades\DB::raw('SUM(CASE WHEN EXISTS (SELECT 1 FROM incoming_mail WHERE incoming_mail.document_id = documents.id) THEN 1 ELSE 0 END) as incoming'),
                \Illuminate\Support\Facades\DB::raw('SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM incoming_mail WHERE incoming_mail.document_id = documents.id) THEN 1 ELSE 0 END) as outgoing')
            )
            ->where('created_at', '>=', now()->subDays(14))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $timelineData = [];
        for ($i = 14; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $found = $timelineRaw->firstWhere('date', $date);
            $timelineData[] = [
                'date' => \Carbon\Carbon::parse($date)->format('d M'),
                'incoming' => $found ? (int)$found->incoming : 0,
                'outgoing' => $found ? (int)$found->outgoing : 0,
            ];
        }

        $userStats = \Illuminate\Support\Facades\DB::table('documents')
            ->join('users', 'documents.created_by', '=', 'users.id')
            ->select('users.name', \Illuminate\Support\Facades\DB::raw('count(documents.id) as count'))
            ->whereNotExists(function ($query) {
                $query->select(\Illuminate\Support\Facades\DB::raw(1))
                      ->from('incoming_mail')
                      ->whereColumn('incoming_mail.document_id', 'documents.id');
            })
            ->groupBy('users.name')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return inertia('dashboard', [
            'outgoingCount' => $outgoingCount,
            'incomingCount' => $incomingCount,
            'templateCount' => $templateCount,
            'timelineData' => $timelineData,
            'userStats' => $userStats,
        ]);
    }
}
