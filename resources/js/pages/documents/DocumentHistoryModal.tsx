import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Download, X } from 'lucide-react';
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
                        <p className="text-sm text-muted-foreground mt-1">
                            Jejak waktu perubahan status untuk dokumen: <span className="font-semibold text-foreground">{document.title}</span>
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full flex-shrink-0">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-6 overflow-auto">
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
