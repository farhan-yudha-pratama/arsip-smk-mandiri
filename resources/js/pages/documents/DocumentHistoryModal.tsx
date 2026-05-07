import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Download, X, Users } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime } from '@/lib/utils';

interface DocumentHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: any;
}

export function DocumentHistoryModal({
    open,
    onOpenChange,
    document,
}: DocumentHistoryModalProps) {
    const [showRecipients, setShowRecipients] = useState(false);
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="outline">{status}</Badge>;
            case 'PROCESSING': return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 gap-1">
                    {status}
                </Badge>
            );
            case 'GENERATED': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">{status}</Badge>;
            case 'SIGNED': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">{status}</Badge>;
            case 'ARCHIVED': return <Badge variant="outline" className="bg-gray-100 text-gray-700">{status}</Badge>;
            case 'FAILED': return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">{status}</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (!open || !document) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6" onClick={() => onOpenChange(false)}>
            <div
                className="w-full max-w-6xl rounded-lg bg-background shadow-lg flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold">Riwayat Dokumen</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">
                                Jejak waktu perubahan status untuk dokumen: <span className="font-semibold text-foreground">{document.title}</span>
                            </p>
                            {document.is_batch && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] uppercase font-bold px-1.5 h-5">Batch</Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {document.is_batch && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 rounded-xl gap-2 font-bold border-2"
                                onClick={() => setShowRecipients(!showRecipients)}
                            >
                                <Users className="h-4 w-4" />
                                {showRecipients ? 'Sembunyikan Penerima' : 'Lihat Penerima Batch'}
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full flex-shrink-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-6 overflow-auto">
                    {showRecipients && document.is_batch && (
                        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="bg-muted/30 rounded-2xl p-6 border-2 border-dashed">
                                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                                    <div className="h-4 w-1 bg-primary rounded-full" />
                                    Daftar Penerima ({document.recipient_type === 'STUDENT' ? document.students?.length : document.teachers?.length} Orang)
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {(document.recipient_type === 'STUDENT' ? document.students : document.teachers)?.map((r: any) => (
                                        <div key={r.id} className="bg-background p-3 rounded-xl border shadow-sm flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {r.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold">{r.name}</span>
                                                <span className="text-[10px] text-muted-foreground">{r.nis || r.nip || '-'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="overflow-x-auto rounded-md border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Versi / Status</th>
                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Catatan</th>
                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Tanggal</th>
                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Pengguna</th>
                                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {document.history && document.history.length > 0 ? (
                                    document.history.map((hist: any) => (
                                        <tr key={hist.id} className="border-b transition-colors hover:bg-muted/30">
                                            <td className="p-3 align-middle">
                                                {getStatusBadge(hist.version_name)}
                                            </td>
                                            <td className="p-3 align-middle text-muted-foreground max-w-[200px] truncate" title={hist.note}>
                                                {hist.note}
                                            </td>
                                            <td className="p-3 align-middle">
                                                {formatDateTime(hist.created_at)}
                                            </td>
                                            <td className="p-3 align-middle">
                                                {hist.creator?.name || 'Sistem'}
                                            </td>
                                            <td className="p-3 align-middle text-right">
                                                {hist.file_path && (
                                                    <Button variant="ghost" size="icon" asChild title="Unduh Versi Ini">
                                                        <a href={`/documents/${document.id}/history/${hist.id}/download`}>
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center align-middle text-muted-foreground">
                                            Tidak ada riwayat ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
