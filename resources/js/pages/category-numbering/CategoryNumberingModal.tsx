import { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Copy, Info, Plus, X } from 'lucide-react';
import categoryNumberingRoutes from '@/routes/category-numbering';
import { CategoryNumbering, FORMAT_TOKENS } from '@/types/category-numbering';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editing: CategoryNumbering | null;
}

// ── Format Preview ──────────────────────────────────────────────────────────
function FormatPreview({ pattern }: { pattern: string }) {
    const now = new Date();
    const monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const preview = pattern
        .replace('{nomor_urut}', '001')
        .replace('{kode}', 'K.02')
        .replace('{instansi}', 'SMK-M')
        .replace('{bulan_romawi}', monthRomawi[now.getMonth()])
        .replace('{tahun}', now.getFullYear().toString());

    if (!pattern) return null;

    return (
        <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-3">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Contoh Hasil
            </p>
            <p className="font-mono text-sm font-semibold tracking-wide text-foreground">
                {preview || <span className="text-muted-foreground">Masukkan format...</span>}
            </p>
        </div>
    );
}

// ── Main Modal ───────────────────────────────────────────────────────────────
export default function CategoryNumberingModal({ isOpen, onClose, editing }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name_numbering_document: '',
        letter_code: '',
        abbreviation: '',
        description: '',
        format_pattern: '',
    });

    useEffect(() => {
        if (!isOpen) return;
        clearErrors();
        if (editing) {
            setData({
                name_numbering_document: editing.name_numbering_document,
                letter_code: editing.letter_code,
                abbreviation: editing.abbreviation,
                description: editing.description ?? '',
                format_pattern: editing.format_pattern,
            });
        } else {
            reset();
            setData('format_pattern', '{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}');
        }
    }, [isOpen, editing]);

    // Sisipkan token ke posisi kursor di dalam input format
    const insertToken = (token: string) => {
        const el = inputRef.current;
        if (!el) {
            setData('format_pattern', data.format_pattern + token);
            return;
        }
        const start = el.selectionStart ?? data.format_pattern.length;
        const end = el.selectionEnd ?? data.format_pattern.length;
        const newVal =
            data.format_pattern.substring(0, start) +
            token +
            data.format_pattern.substring(end);
        setData('format_pattern', newVal);
        // Kembalikan fokus & posisi kursor setelah token
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(start + token.length, start + token.length);
        }, 0);
    };

    const copyToken = (token: string) => {
        navigator.clipboard.writeText(token);
        toast.success(`Token ${token} disalin!`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            put(categoryNumberingRoutes.update.url(editing.id), {
                onSuccess: () => {
                    toast.success('Kategori surat berhasil diperbarui!');
                    onClose();
                },
                onError: () => {
                    toast.error('Gagal memperbarui kategori surat. Periksa kembali data yang dimasukkan.');
                },
            });
        } else {
            post(categoryNumberingRoutes.store.url(), {
                onSuccess: () => {
                    toast.success('Kategori surat berhasil ditambahkan!');
                    onClose();
                },
                onError: () => {
                    toast.error('Gagal menambahkan kategori surat. Periksa kembali data yang dimasukkan.');
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editing ? 'Edit Kategori Surat' : 'Tambah Kategori Surat Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {editing
                            ? 'Perbarui informasi dan format nomor surat untuk kategori ini.'
                            : 'Daftarkan jenis surat baru beserta format penomoran otomatisnya.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2">
                    {/* ── Informasi Dasar ── */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Nama Jenis Surat */}
                        <div className="sm:col-span-2 grid gap-1.5">
                            <Label htmlFor="name_numbering_document">
                                Nama Jenis Surat <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name_numbering_document"
                                placeholder="contoh: Surat Undangan"
                                value={data.name_numbering_document}
                                onChange={(e) => setData('name_numbering_document', e.target.value)}
                            />
                            {errors.name_numbering_document && (
                                <p className="text-xs text-destructive">{errors.name_numbering_document}</p>
                            )}
                        </div>

                        {/* Kode Surat */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="letter_code">
                                Kode Surat <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="letter_code"
                                placeholder="contoh: K.02"
                                value={data.letter_code}
                                onChange={(e) => setData('letter_code', e.target.value)}
                                className="font-mono"
                            />
                            {errors.letter_code && (
                                <p className="text-xs text-destructive">{errors.letter_code}</p>
                            )}
                        </div>

                        {/* Singkatan */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="abbreviation">
                                Singkatan <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="abbreviation"
                                placeholder="contoh: SU"
                                value={data.abbreviation}
                                onChange={(e) => setData('abbreviation', e.target.value)}
                                className="font-mono uppercase"
                            />
                            {errors.abbreviation && (
                                <p className="text-xs text-destructive">{errors.abbreviation}</p>
                            )}
                        </div>

                        {/* Deskripsi */}
                        <div className="sm:col-span-2 grid gap-1.5">
                            <Label htmlFor="description">
                                Deskripsi{' '}
                                <span className="text-muted-foreground text-xs">(opsional)</span>
                            </Label>
                            <Input
                                id="description"
                                placeholder="Deskripsi singkat jenis surat ini..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ── Pembatas ── */}
                    <div className="border-t" />

                    {/* ── Format Penomoran Surat ── */}
                    <div className="space-y-3">
                        <div>
                            <Label className="text-sm font-semibold">
                                Format Nomor Surat <span className="text-destructive">*</span>
                            </Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Gunakan token di bawah untuk menyusun format penomoran surat secara dinamis.
                                Klik token untuk menyisipkan ke posisi kursor, atau klik ikon salin.
                            </p>
                        </div>

                        {/* Token chips */}
                        <div className="flex flex-wrap gap-2">
                            {FORMAT_TOKENS.map((t) => (
                                <div
                                    key={t.token}
                                    className={`group flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-mono font-medium cursor-pointer transition-all hover:shadow-sm ${t.color}`}
                                    title={t.description}
                                    onClick={() => insertToken(t.token)}
                                >
                                    <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                                    <span>{t.token}</span>
                                    <span className="opacity-50">→</span>
                                    <span className="font-sans opacity-70">{t.example}</span>
                                    <button
                                        type="button"
                                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => { e.stopPropagation(); copyToken(t.token); }}
                                        title="Salin token"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Format input */}
                        <div className="grid gap-1.5">
                            <div className="flex items-center gap-2 rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
                                <Input
                                    ref={inputRef}
                                    id="format_pattern"
                                    placeholder="{nomor_urut}/{kode}/{instansi}/{bulan_romawi}/{tahun}"
                                    value={data.format_pattern}
                                    onChange={(e) => setData('format_pattern', e.target.value)}
                                    className="border-0 font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                {data.format_pattern && (
                                    <button
                                        type="button"
                                        className="pr-3 text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => setData('format_pattern', '')}
                                        title="Hapus format"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            {errors.format_pattern && (
                                <p className="text-xs text-destructive">{errors.format_pattern}</p>
                            )}
                        </div>

                        {/* Preview */}
                        <FormatPreview pattern={data.format_pattern} />

                        {/* Info box */}
                        <div className="flex gap-2 rounded-lg border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 p-3 text-xs text-blue-700 dark:text-blue-300">
                            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <p><strong>Catatan:</strong> Bulan selalu ditampilkan dalam angka Romawi (I–XII).</p>
                                <p>Nomor urut bertambah secara global setiap surat berhasil dibuat, tidak direset per jenis surat.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editing ? 'Simpan Perubahan' : 'Tambah Kategori'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
