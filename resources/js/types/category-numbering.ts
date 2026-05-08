export interface CategoryNumbering {
    id: number;
    name_numbering_document: string;
    letter_code: string;
    abbreviation: string;
    description: string | null;
    format_pattern: string;
    sequences_count?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Token yang didukung dalam format_pattern.
 * Digunakan untuk validasi dan builder UI.
 */
export const FORMAT_TOKENS = [
    {
        token: '{nomor_urut}',
        label: 'Nomor Urut',
        description: 'Nomor urut global, bertambah setiap surat dibuat (contoh: 100)',
        example: '100',
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    },
    {
        token: '{kode}',
        label: 'Kode Surat',
        description: 'Kode jenis surat dari letter_code (contoh: K.02)',
        example: 'K.02',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    },
    {
        token: '{instansi}',
        label: 'Nama Instansi',
        description: 'Nama instansi sekolah (contoh: SMK-M)',
        example: 'SMK-M',
        color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
    },
    {
        token: '{bulan_romawi}',
        label: 'Bulan (Romawi)',
        description: 'Bulan dalam angka romawi (contoh: X untuk Oktober)',
        example: 'X',
        color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    },
    {
        token: '{tahun}',
        label: 'Tahun',
        description: 'Tahun 4 digit (contoh: 2026)',
        example: '2026',
        color: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
    },
] as const;
