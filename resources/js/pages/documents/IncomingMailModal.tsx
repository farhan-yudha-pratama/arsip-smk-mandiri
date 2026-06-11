import { useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { toast } from 'sonner';
import documentRoutes from '@/routes/documents';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function IncomingMailModal({ open, onOpenChange }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        sender_origin: '',
        received_at: new Date().toISOString().split('T')[0],
        file: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        post(documentRoutes.incoming.store.url(), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success('Surat masuk berhasil didaftarkan');
            },
            onError: () => {
                toast.error('Gagal mendaftarkan surat masuk');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Registrasi Surat Masuk</DialogTitle>
                    <DialogDescription>
                        Masukkan detail untuk dokumen masuk eksternal.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Judul Dokumen</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="contoh: Surat Undangan Rapat"
                            required
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sender_origin">Nama Pengirim / Asal</Label>
                        <Input
                            id="sender_origin"
                            value={data.sender_origin}
                            onChange={(e) => setData('sender_origin', e.target.value)}
                            placeholder="contoh: Dinas Pendidikan"
                            required
                        />
                        {errors.sender_origin && <p className="text-xs text-destructive">{errors.sender_origin}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="received_at">Tanggal Diterima</Label>
                        <Input
                            id="received_at"
                            type="date"
                            value={data.received_at}
                            onChange={(e) => setData('received_at', e.target.value)}
                            required
                        />
                        {errors.received_at && <p className="text-xs text-destructive">{errors.received_at}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="file">File (PDF/DOCX)</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                            required
                        />
                        {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Mendaftarkan...' : 'Daftarkan Surat'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
