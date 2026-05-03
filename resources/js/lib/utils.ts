import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatDateTime(date: string | Date | number) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(d);
}

export function formatDate(date: string | Date | number) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
    }).format(d);
}
