import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DocumentCounter() {
    const { currentSequence, currentYear, flash } = usePage().props as any;
    const [sequence, setSequence] = useState<string>(currentSequence !== undefined ? currentSequence.toString() : '0');
    const [loading, setLoading] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post('/settings/document-counter', { sequence: parseInt(sequence as string) || 0 }, {
            onFinish: () => setLoading(false),
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Penomoran Surat" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-medium">Penomoran Surat</h2>
                    <p className="text-sm text-muted-foreground">
                        Atur nomor urut awal surat untuk tahun {currentYear}. Nomor ini akan bertambah secara otomatis setiap kali surat baru dibuat.
                        Misalnya jika Anda mengatur nomor urut terakhir menjadi 300, maka surat berikutnya yang dibuat akan bernomor urut 301.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sequence">Nomor Urut Surat Terakhir</Label>
                        <div className="flex gap-2">
                            <Input
                                id="sequence"
                                type="number"
                                min="0"
                                value={sequence}
                                onChange={(e) => setSequence(e.target.value)}
                                className="max-w-md"
                                required
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-md font-medium text-destructive">Zona Bahaya (Reset Penomoran)</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Gunakan tombol di bawah ini jika penomoran otomatis tidak tereset pada awal tahun baru. 
                        Ini akan memaksa nomor urut surat kembali ke 0.
                    </p>
                    <Dialog open={isResetOpen} onOpenChange={(open) => {
                        setIsResetOpen(open);
                        if (!open) setConfirmText('');
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                Reset Penomoran Sekarang
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Konfirmasi Reset Penomoran</DialogTitle>
                            <DialogDescription>
                                Tindakan ini akan mereset nomor urut surat kembali ke 0.
                                Silakan ketik <strong>RESET</strong> pada kolom di bawah ini untuk mengonfirmasi.
                            </DialogDescription>
                            
                            <div className="grid gap-2 py-4">
                                <Label htmlFor="confirmReset" className="sr-only">Ketik RESET</Label>
                                <Input 
                                    id="confirmReset" 
                                    value={confirmText} 
                                    onChange={(e) => setConfirmText(e.target.value)} 
                                    placeholder="Ketik RESET disini"
                                    autoComplete="off"
                                />
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <DialogClose asChild>
                                    <Button variant="secondary">Batal</Button>
                                </DialogClose>
                                <Button 
                                    variant="destructive" 
                                    disabled={confirmText !== 'RESET' || loading}
                                    onClick={() => {
                                        setSequence(0);
                                        setLoading(true);
                                        router.post('/settings/document-counter', { sequence: 0 }, {
                                            onFinish: () => {
                                                setLoading(false);
                                                setIsResetOpen(false);
                                                setConfirmText('');
                                            },
                                            preserveScroll: true,
                                        });
                                    }}
                                >
                                    {loading ? 'Mereset...' : 'Reset Sekarang'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                        {flash.success}
                    </div>
                )}
                
                {flash?.error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {flash.error}
                    </div>
                )}
            </div>
        </>
    );
}
