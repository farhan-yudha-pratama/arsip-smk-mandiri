import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Student {
    id: string;
    nis: string;
    nisn: string | null;
    name: string;
    kelas: string | null;
    periode: string | null;
}

interface Props {
    students: { data: Student[]; links: any[] };
    filters: {
        search?: string;
        kelas?: string;
        periode?: string;
        sort?: string;
        order?: 'asc' | 'desc';
    };
    kelasOptions: string[];
    periodeOptions: string[];
}

export default function StudentIndex({ students, filters, kelasOptions, periodeOptions }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    
    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== filters.search) {
                applyFilters({ search });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const applyFilters = (newFilters: any) => {
        router.get('/students', { ...filters, ...newFilters }, { preserveState: true, replace: true });
    };

    const handleSort = (column: string) => {
        if (filters.sort === column) {
            applyFilters({ order: filters.order === 'asc' ? 'desc' : 'asc' });
        } else {
            applyFilters({ sort: column, order: 'asc' });
        }
    };

    const renderSortIcon = (column: string) => {
        if (filters.sort !== column) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
        return filters.order === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    };

    return (
        <>
            <Head title="Data Siswa" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Siswa</CardTitle>
                            <CardDescription>Daftar data siswa yang telah disinkronisasi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
                                <div className="relative w-full md:max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama atau NIS..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Select value={filters.kelas || 'all'} onValueChange={(val) => applyFilters({ kelas: val === 'all' ? null : val })}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Semua Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kelas</SelectItem>
                                            {kelasOptions.map((k) => (
                                                <SelectItem key={k} value={k}>{k}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={filters.periode || 'all'} onValueChange={(val) => applyFilters({ periode: val === 'all' ? null : val })}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Semua Periode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Periode</SelectItem>
                                            {periodeOptions.map((p) => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="relative w-full">
                                {/* Mobile View (Cards) */}
                                <div className="block md:hidden">
                                    <div className="flex flex-col gap-4">
                                        {students.data.map((student) => (
                                            <div key={student.id} className="rounded-lg border p-4">
                                                <div className="font-semibold">{student.name}</div>
                                                <div className="text-sm text-muted-foreground">NIS: {student.nis}</div>
                                                <div className="text-sm text-muted-foreground">Kelas: {student.kelas} ({student.periode})</div>
                                            </div>
                                        ))}
                                        {students.data.length === 0 && (
                                            <div className="text-center text-muted-foreground">Belum ada data siswa.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop View (Table) */}
                                <div className="hidden md:block overflow-x-auto rounded-md border">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b bg-muted/50">
                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <th 
                                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none"
                                                    onClick={() => handleSort('nis')}
                                                >
                                                    <div className="flex items-center">NIS {renderSortIcon('nis')}</div>
                                                </th>
                                                <th 
                                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none"
                                                    onClick={() => handleSort('name')}
                                                >
                                                    <div className="flex items-center">Nama Siswa {renderSortIcon('name')}</div>
                                                </th>
                                                <th 
                                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none"
                                                    onClick={() => handleSort('kelas')}
                                                >
                                                    <div className="flex items-center">Kelas {renderSortIcon('kelas')}</div>
                                                </th>
                                                <th 
                                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none"
                                                    onClick={() => handleSort('periode')}
                                                >
                                                    <div className="flex items-center">Periode {renderSortIcon('periode')}</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {students.data.map((student) => (
                                                <tr key={student.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <td className="p-4 align-middle">{student.nis}</td>
                                                    <td className="p-4 align-middle font-medium">{student.name}</td>
                                                    <td className="p-4 align-middle">{student.kelas || '-'}</td>
                                                    <td className="p-4 align-middle">{student.periode || '-'}</td>
                                                </tr>
                                            ))}
                                            {students.data.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">Belum ada data yang cocok.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Pagination links={students.links} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
