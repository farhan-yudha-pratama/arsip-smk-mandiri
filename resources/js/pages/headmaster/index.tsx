import { Head, useForm } from '@inertiajs/react';
import { Save, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import headmasterRoutes from '@/routes/headmaster';

interface Props {
    headmaster: { name: string } | null;
}

export default function HeadmasterSettings({ headmaster }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: headmaster?.name || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(headmasterRoutes.store.url(), {
            onSuccess: () => toast.success('Nama Kepala Sekolah berhasil disimpan!'),
            onError: () => toast.error('Gagal menyimpan nama Kepala Sekolah.'),
        });
    };

    return (
        <>
            <Head title="Pengaturan Kepala Sekolah" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Kepala Sekolah</h1>
                    <p className="text-muted-foreground">
                        Atur nama Kepala Sekolah yang akan digunakan sebagai default pada dokumen surat.
                    </p>
                </div>

                <div className="max-w-xl space-y-6">
                    {headmaster ? (
                        <div className="rounded-lg border bg-muted/30 p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Kepala Sekolah Saat Ini</p>
                                    <p className="text-lg font-semibold">{headmaster.name}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed p-4 text-center">
                            <p className="text-sm text-muted-foreground">Belum ada data Kepala Sekolah yang diatur.</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Nama Lengkap beserta Gelar
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Contoh: Dadang S.Kom"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-[0.8rem] font-medium text-destructive">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end border-t pt-4">
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
