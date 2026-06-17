import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogOut } from 'lucide-react';

export default function Unconfirmed() {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <Head title="Belum Dikonfirmasi" />
            <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <a href="#" className="flex flex-col items-center gap-2 font-medium">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <AlertCircle className="size-8" />
                        </div>
                        <span className="sr-only">Arsip SMK Mandiri</span>
                    </a>
                    <h1 className="text-2xl font-bold">Menunggu Konfirmasi</h1>
                </div>
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">Akun Belum Aktif</CardTitle>
                            <CardDescription>
                                Akun Anda belum dikonfirmasi oleh admin. Silakan hubungi admin untuk mengaktifkan akun Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <Button onClick={handleLogout} className="w-full">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Keluar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
