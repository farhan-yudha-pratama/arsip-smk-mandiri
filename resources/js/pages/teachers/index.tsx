import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Teacher {
    id: string;
    nip: string;
    name: string;
}

interface Props {
    teachers: { data: Teacher[]; links: any[] };
    filters: {
        search?: string;
        sort?: string;
        order?: 'asc' | 'desc';
    };
}

export default function TeacherIndex({ teachers, filters }: Props) {
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
        router.get('/teachers', { ...filters, ...newFilters }, { preserveState: true, replace: true });
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
            <Head title="Data Guru" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Guru</CardTitle>
                            <CardDescription>Daftar data guru yang telah disinkronisasi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
                                <div className="relative w-full md:max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama atau NIP..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <div className="relative w-full">
                                {/* Mobile View (Cards) */}
                                <div className="block md:hidden">
                                    <div className="flex flex-col gap-4">
                                        {teachers.data.map((teacher) => (
                                            <div key={teacher.id} className="rounded-lg border p-4">
                                                <div className="font-semibold">{teacher.name}</div>
                                                <div className="text-sm text-muted-foreground">NIP: {teacher.nip}</div>
                                            </div>
                                        ))}
                                        {teachers.data.length === 0 && (
                                            <div className="text-center text-muted-foreground">Belum ada data guru.</div>
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
                                                    onClick={() => handleSort('nip')}
                                                >
                                                    <div className="flex items-center">NIP {renderSortIcon('nip')}</div>
                                                </th>
                                                <th 
                                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none"
                                                    onClick={() => handleSort('name')}
                                                >
                                                    <div className="flex items-center">Nama Guru {renderSortIcon('name')}</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {teachers.data.map((teacher) => (
                                                <tr key={teacher.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <td className="p-4 align-middle">{teacher.nip}</td>
                                                    <td className="p-4 align-middle font-medium">{teacher.name}</td>
                                                </tr>
                                            ))}
                                            {teachers.data.length === 0 && (
                                                <tr>
                                                    <td colSpan={2} className="p-4 text-center text-muted-foreground">Belum ada data yang cocok.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Pagination links={teachers.links} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
