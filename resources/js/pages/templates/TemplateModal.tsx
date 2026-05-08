import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DialogFooter,
    DialogHeader,
    DialogContent,
    Dialog,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import templateRoutes from '@/routes/templates';
import { Template } from '@/types/template';


interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingTemplate: Template | null;
}

export default function TemplateModal({ isOpen, onClose, editingTemplate }: TemplateModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            title: '',
            document: '',
            metadata: [] as string[],
        });

    const [newMetadataKey, setNewMetadataKey] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (editingTemplate) {
                setData({
                    title: editingTemplate.name,
                    document: '',
                    metadata: (Array.isArray(editingTemplate.meta_data) ? editingTemplate.meta_data : []) as string[],
                });
            } else {
                setData({
                    title: '',
                    document: '',
                    metadata: [],
                });
            }
            setNewMetadataKey('');
        }
    }, [isOpen, editingTemplate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.size > 100 * 1024 * 1024) {
                toast.error('Ukuran file melebihi batas 100 MB');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setData('document', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addMetadataKey = () => {
        if (newMetadataKey && !data.metadata.includes(newMetadataKey)) {
            setData('metadata', [...data.metadata, newMetadataKey]);
            setNewMetadataKey('');
        }
    };

    const removeMetadataKey = (key: string) => {
        setData(
            'metadata',
            data.metadata.filter((k) => k !== key),
        );
    };

    const handleExtractVariables = async () => {
        if (!data.document) {
            toast.error('Pilih file template terlebih dahulu');
            return;
        }

        setIsExtracting(true);
        try {
            const response = await axios.post(
                templateRoutes.extractVariables().url,
                {
                    document: data.document,
                },
            );

            if (response.data.success && response.data.variables) {
                const newVariables = response.data.variables.filter(
                    (v: string) => !data.metadata.includes(v)
                );

                if (newVariables.length > 0) {
                    setData('metadata', [...data.metadata, ...newVariables]);
                    toast.success(`Berhasil menemukan ${newVariables.length} variabel baru`);
                } else {
                    toast.info('Tidak ada variabel baru ditemukan atau semua sudah ditambahkan');
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Gagal mengekstrak variabel');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTemplate) {
            post(templateRoutes.update.url(editingTemplate.id.toString()), {
                onSuccess: () => {
                    toast.success('Template berhasil diupdate');
                },
                onError: () => {
                    toast.error('Gagal memperbarui templat. Silakan periksa data yang dimasukkan.');
                }
            });
            onClose();
        } else {
            post(templateRoutes.store.url(), {
                onSuccess: () => {
                    toast.success('Template telah diunggah dan sedang dalam antrean untuk diproses');
                },
                onError: () => {
                    toast.error('Gagal membuat template. Silakan periksa data yang dimasukkan.');
                }
            });
            onClose();
            toast.info('Template sedang diunggah dan diproses di latar belakang...');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingTemplate
                            ? 'Ubah Template'
                            : 'Tambah template baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingTemplate
                            ? 'Perbarui metadata template.'
                            : 'Unggah template DOCX baru dan tentukan kategorinya.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Nama Template</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) =>
                                setData('title', e.target.value)
                            }
                            placeholder="e.g. Surat Keterangan Lulus"
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Metadata Kolom (Placeholders)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newMetadataKey}
                                onChange={(e) =>
                                    setNewMetadataKey(e.target.value)
                                }
                                placeholder="e.g. namea, tanggal, alamat"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addMetadataKey();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addMetadataKey}
                            >
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {data.metadata.map((key) => (
                                <Badge
                                    key={key}
                                    variant="secondary"
                                    className="flex items-center gap-1 px-2 py-1 max-w-full"
                                >
                                    <span 
                                        className="cursor-pointer hover:text-primary transition-colors truncate max-w-[150px]"
                                        onClick={() => {
                                            const tag = `{{${key}}}`;
                                            navigator.clipboard.writeText(tag);
                                            toast.success(`Copied ${tag} to clipboard`);
                                        }}
                                        title={`Klik untuk copy placeholder: {{${key}}}`}
                                    >
                                        {key}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeMetadataKey(key)
                                        }
                                        className="ml-1 rounded-full hover:bg-muted p-0.5 shrink-0"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="space-y-1 mt-1">
                            <p className="text-[10px] text-muted-foreground">
                                Tambahkan kunci yang akan digunakan sebagai penanda tempat dalam
                                dokumen (misalnya, nama untuk {`{{ nama }}`})
                            </p>
                            <p className="text-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 p-2 rounded border border-amber-100 dark:border-amber-900">
                                <strong>Tips:</strong> Klik pada label di atas untuk menyalin, lalu <strong>paste</strong> ke Word. Hindari mengetik manual di Word untuk mencegah placeholder terpecah di XML dokumen.
                            </p>
                        </div>
                    </div>
                    {!editingTemplate && (
                        <div className="grid gap-2">
                            <Label htmlFor="document">
                                Template File (DOCX)
                            </Label>
                            <Input
                                id="document"
                                type="file"
                                accept=".docx"
                                onChange={handleFileChange}
                            />
                            {data.document && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleExtractVariables}
                                    disabled={isExtracting}
                                    className="mt-2 w-max"
                                >
                                    {isExtracting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Mengekstrak...
                                        </>
                                    ) : (
                                        'Generate Variabel'
                                    )}
                                </Button>
                            )}
                            {errors.document && (
                                <p className="text-xs text-destructive">
                                    {errors.document}
                                </p>
                            )}
                        </div>
                    )}
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingTemplate ? 'Ubah' : 'Buat'} Template
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
