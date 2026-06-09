import { Head, router } from '@inertiajs/react';
import { Search, FileText, User, UserCircle, Globe, History, Filter, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';
import { Pagination } from '@/components/Pagination';
import { Document } from '@/types/document';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Props {
    documents: { data: Document[]; links: any[] };
    filters: any;
}

export default function ArchiveReport({ documents, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.type || 'all');
    
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportType, setExportType] = useState('all');
    const [exportStartDate, setExportStartDate] = useState('');
    const [exportEndDate, setExportEndDate] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const applyFilters = () => {
        router.get('/laporan-arsip', {
            search: searchTerm,
            type: typeFilter !== 'all' ? typeFilter : undefined,
        }, { preserveState: true, replace: true });
    };

    useEffect(() => {
        if (typeFilter !== filters?.type && !(typeFilter === 'all' && !filters?.type)) {
            applyFilters();
        }
    }, [typeFilter]);

    const getRecipientIcon = (type: string) => {
        switch (type) {
            case 'STUDENT': return <User className="h-3 w-3 mr-1" />;
            case 'TEACHER': return <UserCircle className="h-3 w-3 mr-1" />;
            case 'EXTERNAL': return <Globe className="h-3 w-3 mr-1" />;
            default: return null;
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        const params = new URLSearchParams();
        if (exportType !== 'all') params.append('type', exportType);
        if (exportStartDate) params.append('start_date', exportStartDate);
        if (exportEndDate) params.append('end_date', exportEndDate);
        
        try {
            const response = await fetch(`/laporan-arsip/export?${params.toString()}`);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'Laporan_Arsip.pdf';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success('Laporan PDF berhasil di-generate!');
            setIsExportModalOpen(false);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Gagal men-generate laporan PDF.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            <Head title="Laporan Arsip" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Laporan Arsip</h1>
                        <p className="text-muted-foreground">
                            Riwayat dokumen yang telah diarsipkan.
                        </p>
                    </div>
                    <div>
                        <Button onClick={() => setIsExportModalOpen(true)}>
                            <Download className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan judul atau tujuan..."
                            className="flex-1 bg-transparent text-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') applyFilters();
                            }}
                        />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-md border border-dashed">
                            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Jenis:</span>
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[160px] h-9 text-xs">
                                <SelectValue placeholder="Semua" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="incoming">Surat Masuk</SelectItem>
                                <SelectItem value="outgoing">Surat Keluar</SelectItem>
                            </SelectContent>
                        </Select>

                        {(searchTerm || typeFilter !== 'all') && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                    setSearchTerm('');
                                    setTypeFilter('all');
                                    router.get('/laporan-arsip');
                                }}
                                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Judul Dokumen</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Jenis</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pembuat Arsip</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tujuan (Penerima)</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Waktu Dibuat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.data.length > 0 ? (
                                    documents.data.map((doc: any) => (
                                        <tr key={doc.id} className="border-b transition-colors hover:bg-muted/30">
                                            <td className="p-4 align-middle font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                    <span>{doc.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {doc.incoming_mail ? (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Surat Masuk</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Surat Keluar</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{doc.creator?.name || 'Sistem'}</span>
                                                    <span className="text-xs text-muted-foreground">{doc.creator?.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center font-medium">
                                                        {getRecipientIcon(doc.recipient_type)}
                                                        {doc.recipient_name || 'Tidak ada tujuan spesifik'}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        Tipe: {doc.recipient_type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="font-medium text-blue-600">
                                                        {formatRelativeTime(doc.created_at)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center align-middle text-muted-foreground">
                                            Tidak ada riwayat arsip yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {documents.links && documents.links.length > 0 && (
                        <div className="p-4 border-t flex justify-end">
                             <Pagination links={documents.links} />
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Export Laporan PDF</DialogTitle>
                        <DialogDescription>
                            Pilih kriteria laporan arsip yang ingin diekspor.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="export-type">Jenis Surat</Label>
                            <Select value={exportType} onValueChange={setExportType}>
                                <SelectTrigger id="export-type">
                                    <SelectValue placeholder="Pilih jenis surat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Surat</SelectItem>
                                    <SelectItem value="incoming">Surat Masuk</SelectItem>
                                    <SelectItem value="outgoing">Surat Keluar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start-date">Tanggal Awal</Label>
                                <input 
                                    type="date" 
                                    id="start-date"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={exportStartDate}
                                    onChange={(e) => setExportStartDate(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date">Tanggal Akhir</Label>
                                <input 
                                    type="date" 
                                    id="end-date"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={exportEndDate}
                                    onChange={(e) => setExportEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Kosongkan rentang tanggal jika ingin mengekspor semua data berdasarkan jenis yang dipilih.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsExportModalOpen(false)} disabled={isExporting}>
                            Batal
                        </Button>
                        <Button onClick={handleExport} disabled={isExporting}>
                            {isExporting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang Generate...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
