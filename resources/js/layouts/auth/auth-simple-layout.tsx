import { Link } from '@inertiajs/react';
import { School } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/50 p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-8 bg-card p-8 rounded-2xl shadow-sm border border-border/50">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-3 font-medium"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <School className="size-8" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold tracking-tight text-foreground">SMK Mandiri Medan</h2>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Sistem Manajemen Arsip</p>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center mt-4">
                            <h1 className="text-xl font-bold">{title}</h1>
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}