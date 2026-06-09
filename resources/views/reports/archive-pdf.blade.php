<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Arsip</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #333;
        }
        h2 {
            text-align: center;
            margin-bottom: 5px;
        }
        .subtitle {
            text-align: center;
            margin-bottom: 20px;
            color: #666;
            font-size: 11px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .badge {
            display: inline-block;
            padding: 3px 6px;
            font-size: 10px;
            font-weight: bold;
            border-radius: 4px;
        }
        .badge-incoming {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .badge-outgoing {
            background-color: #d1fae5;
            color: #065f46;
        }
    </style>
</head>
<body>
    <h2>Laporan Arsip Dokumen</h2>
    <div class="subtitle">
        Jenis Laporan: 
        @if($type === 'incoming') Surat Masuk 
        @elseif($type === 'outgoing') Surat Keluar 
        @else Semua Surat 
        @endif
        <br>
        Periode: 
        @if($startDate && $endDate)
            {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}
        @else
            Semua Waktu
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Judul Dokumen</th>
                <th>Jenis</th>
                <th>Pembuat Arsip</th>
                <th>Tujuan (Penerima)</th>
                <th>Waktu Dibuat</th>
            </tr>
        </thead>
        <tbody>
            @forelse($documents as $index => $doc)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $doc->title }}</td>
                    <td>
                        @if($doc->incomingMail)
                            <span class="badge badge-incoming">Surat Masuk</span>
                        @else
                            <span class="badge badge-outgoing">Surat Keluar</span>
                        @endif
                    </td>
                    <td>
                        {{ $doc->creator->name ?? 'Sistem' }}<br>
                        <span style="font-size: 10px; color: #666;">{{ $doc->creator->email ?? '' }}</span>
                    </td>
                    <td>
                        {{ $doc->recipient_name ?? 'Tidak ada spesifik' }}<br>
                        <span style="font-size: 10px; color: #666;">Tipe: {{ $doc->recipient_type }}</span>
                    </td>
                    <td>{{ $doc->created_at->format('d M Y H:i') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">Tidak ada data arsip.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
