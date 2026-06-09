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

export function formatDateTime(date?: string | Date | number | null) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(d);
}

export function formatDate(date?: string | Date | number | null) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
    }).format(d);
}
const indonesianMonths = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function formatIndonesianDate(date?: string | Date | number | null) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = indonesianMonths[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

export function formatIndonesianDateTime(date?: string | Date | number | null) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = indonesianMonths[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
}

export function formatIndonesianTime(date?: string | Date | number | null) {
    if (!date) return '';
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function parseIndonesianDate(str: string) {
    if (!str) return '';
    const parts = str.split(' ');
    if (parts.length !== 3) {
        const dashParts = str.split('-');
        if (dashParts.length === 3) return `${dashParts[2]}-${dashParts[1]}-${dashParts[0]}`;
        return '';
    }
    const day = parts[0];
    const monthIndex = indonesianMonths.indexOf(parts[1]);
    const month = String(monthIndex + 1).padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
}

export function parseIndonesianDateTime(str: string) {
    if (!str) return '';
    const spaceCount = (str.match(/ /g) || []).length;
    if (spaceCount === 1) {
        const [datePart, timePart] = str.split(' ');
        const dashParts = datePart.split('-');
        if (dashParts.length === 3) return `${dashParts[2]}-${dashParts[1]}-${dashParts[0]}T${timePart}`;
        return '';
    }

    const lastSpaceIdx = str.lastIndexOf(' ');
    if (lastSpaceIdx === -1) return '';
    
    const datePart = str.substring(0, lastSpaceIdx);
    const timePart = str.substring(lastSpaceIdx + 1);
    
    const parts = datePart.split(' ');
    if (parts.length !== 3) return '';
    
    const day = parts[0];
    const monthIndex = indonesianMonths.indexOf(parts[1]);
    const month = String(monthIndex + 1).padStart(2, '0');
    const year = parts[2];
    
    return `${year}-${month}-${day}T${timePart}`;
}

export function formatRelativeTime(date?: string | Date | number | null) {
    if (!date) return 'N/A';
    const d = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) return `${diffInYears} tahun lalu`;
    if (diffInMonths > 0) return `${diffInMonths} bulan lalu`;
    if (diffInDays > 0) return `${diffInDays} hari lalu`;
    if (diffInHours > 0) return `${diffInHours} jam lalu`;
    if (diffInMinutes > 0) return `${diffInMinutes} menit lalu`;
    return 'baru saja';
}
