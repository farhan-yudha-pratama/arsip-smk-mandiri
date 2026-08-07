import { Link } from '@inertiajs/react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Pagination({ links }: { links: any[] }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center gap-1">
            {links.map((link, k) => (
                <div key={k}>
                    {link.url === null ? (
                        <Button variant="outline" disabled className="h-8 px-3 text-xs" dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <Link
                            href={link.url}
                            preserveState
                            className={cn(
                                buttonVariants({ variant: link.active ? "default" : "outline" }),
                                "h-8 px-3 text-xs"
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
