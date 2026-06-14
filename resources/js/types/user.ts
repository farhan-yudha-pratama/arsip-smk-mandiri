export interface Student {
    id: string;
    name: string;
    nis: string;
    kelas?: string | null;
    periode?: string | null;
}

export interface Teacher {
    id: string;
    name: string;
    nip: string;
}
