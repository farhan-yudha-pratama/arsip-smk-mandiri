import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Plus,
    Edit2,
    Trash2,
    Hash,
    FileText,
    Tag,
    ChevronRight,
    Loader2,
    Copy,
    BookMarked,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import CategoryNumberingModal from './CategoryNumberingModal';
import { CategoryNumbering, FORMAT_TOKENS } from '@/types/category-numbering';
import categoryNumberingRoutes from '@/routes/category-numbering';

interface Props {
    categories: CategoryNumbering[];
}

function FormatDisplay({ pattern }: { pattern: string }) {
    const parts: { text: string; isToken: boolean; color?: string }[] = [];
    let remaining = pattern;

    while (remaining.length > 0) {
        let foundToken = false;
        for (const t of FORMAT_TOKENS) {
            const idx = remaining.indexOf(t.token);
            if (idx === 0) {
                parts.push({ text: t.token, isToken: true, color: t.color });
                remaining = remaining.slice(t.token.length);
                foundToken = true;
                break;
            } else if (idx > 0) {
                parts.push({ text: remaining.slice(0, idx), isToken: false });
                parts.push({ text: t.token, isToken: true, color: t.color });
                remaining = remaining.slice(idx + t.token.length);
                foundToken = true;
                break;
            }
        }
        if (!foundToken) {
            parts.push({ text: remaining, isToken: false });
            break;
        }
    }

    return (
        <span className="inline-flex flex-wrap items-center gap-0.5 font-mono text-xs">
            {parts.map((p, i) =>
                p.isToken ? (
                    <span
                        key={i}
                        className={`rounded px-1 py-0.5 border text-[10px] font-medium ${p.color}`}
                    >
                        {p.text}
                    </span>
                ) : (
                    <span key={i} className="text-muted-foreground">
                        {p.text}
                    </span>
                ),
            )}
        </span>
    );
}

function NomorContoh({ pattern, kode }: { pattern: string; kode: string }) {
    const now = new Date();
    const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return pattern
        .replace('{nomor_urut}', '001')
        .replace('{kode}', kode)
        .replace('{instansi}', 'SMK-M')
        .replace('{bulan_romawi}', romawi[now.getMonth()])
        .replace('{tahun}', now.getFullYear().toString());
}

export default function CategoryNumberingIndex({ categories }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryNumbering | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategoryNumbering | null>(null);

    const { delete: destroy, processing: deleting } = useForm();

    const openCreate = () => {
        setEditing(null);
        setIsModalOpen(true);
    };

    const openEdit = (cat: CategoryNumbering) => {
        setEditing(cat);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        destroy(categoryNumberingRoutes.destroy.url(deleteTarget.id), {
            onSuccess: () => {
                toast.success(`Kategori "${deleteTarget.name_numbering_document}" berhasil dihapus.`);
                setDeleteTarget(null);
            },
            onError: (errs: any) => {
                const msg = errs?.error ?? 'Gagal menghapus kategori surat.';
                toast.error(msg);
                setDeleteTarget(null);
            },
        });
    };

    const copyContoh = (cat: CategoryNumbering) => {
        const contoh = NomorContoh({ pattern: cat.format_pattern, kode: cat.letter_code });
        navigator.clipboard.writeText(contoh);
        toast.success(`Disalin: ${contoh}`);
    };

    return (
        <>
            <Head title="Kategori Penomoran Surat" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* ── Header ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <BookMarked className="h-4 w-4" />
                            <span>Manajemen</span>
                            <ChevronRight className="h-3 w-3" />
                            <span>Kategori Surat</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Kategori Penomoran Surat
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Kelola jenis-jenis surat beserta format penomoran otomatisnya.
                            Format menggunakan token dinamis yang akan diganti saat surat dibuat.
                        </p>
                    </div>
                    <Button onClick={openCreate} className="w-full sm:w-auto shrink-0">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* ── Token Reference Card ── */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="px-5 py-3 border-b">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            Referensi Token Format
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Token-token ini dapat digunakan dalam format penomoran surat secara dinamis.
                        </p>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                        {FORMAT_TOKENS.map((t) => (
                            <div
                                key={t.token}
                                className="rounded-lg border p-3 space-y-1 hover:shadow-sm transition-shadow"
                            >
                                <span
                                    className={`inline-block rounded px-2 py-0.5 font-mono text-xs font-medium border ${t.color}`}
                                >
                                    {t.token}
                                </span>
                                <p className="text-xs font-medium">{t.label}</p>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    {t.description}
                                </p>
                                <p className="text-[10px] font-mono text-muted-foreground">
                                    Contoh:{' '}
                                    <span className="font-semibold text-foreground">{t.example}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Tabel Kategori ── */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="px-5 py-3 border-b flex items-center justify-between">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            Daftar Kategori
                        </h2>
                        <Badge variant="secondary" className="text-xs">
                            {categories.length} kategori
                        </Badge>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    <th className="h-11 px-5 text-left align-middle font-medium text-muted-foreground">
                                        Jenis Surat
                                    </th>
                                    <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Kode
                                    </th>
                                    <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Singkatan
                                    </th>
                                    <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Format Penomoran
                                    </th>
                                    <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Contoh Nomor
                                    </th>
                                    <th className="h-11 px-4 text-center align-middle font-medium text-muted-foreground">
                                        Surat Dibuat
                                    </th>
                                    <th className="h-11 px-4 text-right align-middle font-medium text-muted-foreground">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr
                                            key={cat.id}
                                            className="border-b transition-colors hover:bg-muted/25"
                                        >
                                            {/* Nama */}
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-primary shrink-0" />
                                                    <div>
                                                        <p className="font-medium leading-tight">
                                                            {cat.name_numbering_document}
                                                        </p>
                                                        {cat.description && (
                                                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight max-w-[200px] truncate">
                                                                {cat.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Kode */}
                                            <td className="px-4 py-3 align-middle">
                                                <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-semibold">
                                                    {cat.letter_code}
                                                </code>
                                            </td>

                                            {/* Singkatan */}
                                            <td className="px-4 py-3 align-middle">
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    {cat.abbreviation}
                                                </Badge>
                                            </td>

                                            {/* Format */}
                                            <td className="px-4 py-3 align-middle max-w-[280px]">
                                                <FormatDisplay pattern={cat.format_pattern} />
                                            </td>

                                            {/* Contoh Nomor */}
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex items-center gap-1.5">
                                                    <code className="text-xs font-mono text-muted-foreground">
                                                        {NomorContoh({
                                                            pattern: cat.format_pattern,
                                                            kode: cat.letter_code,
                                                        })}
                                                    </code>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyContoh(cat)}
                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                        title="Salin contoh nomor"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Jumlah surat */}
                                            <td className="px-4 py-3 align-middle text-center">
                                                <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-2">
                                                    {cat.sequences_count ?? 0}
                                                </span>
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => openEdit(cat)}
                                                        title="Edit kategori"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => setDeleteTarget(cat)}
                                                        title="Hapus kategori"
                                                        disabled={(cat.sequences_count ?? 0) > 0}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="h-32 text-center align-middle text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Hash className="h-8 w-8 opacity-20" />
                                                <p className="text-sm">Belum ada kategori surat.</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={openCreate}
                                                >
                                                    <Plus className="mr-2 h-3.5 w-3.5" />
                                                    Tambah Kategori
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Modal Tambah / Edit ── */}
            <CategoryNumberingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editing={editing}
            />

            {/* ── Dialog Konfirmasi Hapus ── */}
            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori Surat?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Kategori{' '}
                            <span className="font-semibold text-foreground">
                                {deleteTarget?.name_numbering_document}
                            </span>{' '}
                            (
                            <code className="font-mono text-xs">{deleteTarget?.letter_code}</code>
                            ) akan dihapus secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
