import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

// Pastikan skema URL pagination selalu mengikuti protokol browser (http/https)
function normalizeUrl(url: string): string {
    if (typeof window === 'undefined') return url;
    return url.replace(/^https?:\/\//, window.location.protocol + '//');
}

export function Pagination({ links }: { links: any[] }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center gap-1">
            {links.map((link, k) => {
                const baseClasses = "inline-flex items-center justify-center rounded-md border h-8 px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
                const activeClasses = "bg-primary text-primary-foreground shadow hover:bg-primary/90 border-transparent";
                const outlineClasses = "bg-background shadow-sm hover:bg-accent hover:text-accent-foreground border-input";

                return (
                    <div key={k}>
                        {link.url === null ? (
                            <button
                                disabled
                                className={cn(baseClasses, outlineClasses)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <Link
                                href={normalizeUrl(link.url)}
                                preserveState
                                className={cn(baseClasses, link.active ? activeClasses : outlineClasses)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
