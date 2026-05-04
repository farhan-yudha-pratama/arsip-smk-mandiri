import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export function Pagination({ links }: { links: any[] }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center gap-1">
            {links.map((link, k) => (
                <div key={k}>
                    {link.url === null ? (
                        <Button variant="outline" disabled className="h-8 px-3 text-xs" dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <Button
                            variant={link.active ? "default" : "outline"}
                            className="h-8 px-3 text-xs"
                            asChild
                        >
                            <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}
