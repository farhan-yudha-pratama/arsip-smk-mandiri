import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';

import { BindukStudent } from '@/types';

export default function GetStudent() {
    const [token, setToken] = useState('');
    const [students, setStudents] = useState<BindukStudent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const fetchStudents = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BINDUK_APP_URL}/api/students/active?token=${token}`);
            if (!response.ok) {
                throw new Error('Failed to fetch students. Invalid token or server error.');
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                // Save to local database
                await axios.post('/settings/get-student', { students: data.data });

                setStudents(data.data);
                setSuccessMsg(`Berhasil mengambil dan menyimpan ${data.data.length} data siswa!`);
                setToken('');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Tarik Data Siswa" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-medium">Tarik Data Siswa</h2>
                    <p className="text-sm text-muted-foreground">
                        Tarik data siswa aktif dari API menggunakan token keamanan.
                    </p>
                </div>

                <form onSubmit={fetchStudents} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="token">Token API</Label>
                        <div className="flex gap-2">
                            <Input
                                id="token"
                                value={token}
                                onChange={(e) => {
                                    setToken(e.target.value);
                                    if (successMsg) setSuccessMsg(null);
                                    if (error) setError(null);
                                }}
                                placeholder="Masukkan Token API"
                                className="max-w-md"
                                required
                            />
                            <Button type="submit" disabled={loading || token.trim().length === 0}>
                                {loading ? 'Menarik Data...' : 'Tarik Data Siswa'}
                            </Button>
                        </div>
                    </div>
                </form>

                {error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                        {successMsg}
                    </div>
                )}

                {students.length > 0 && (
                    <div className="rounded-md border bg-card">
                        <div className="overflow-x-auto">
                            {/* Mobile View (Cards) */}
                            <div className="block md:hidden p-4">
                                <div className="flex flex-col gap-4">
                                    {students.map((student) => (
                                        <div key={student.student_id} className="flex flex-col gap-2 p-4 bg-muted/20 rounded-xl border">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{student.nama_siswa}</span>
                                                <span className="text-xs text-muted-foreground">NIS: {student.nis}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm mt-2 pt-2 border-t">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">Kelas</span>
                                                    <span>{student.nama_kelas}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">Angkatan</span>
                                                    <span>{student.tahun_angkatan || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop View (Table) */}
                            <table className="hidden md:table w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left font-medium">ID Siswa</th>
                                        <th className="p-3 text-left font-medium">NIS</th>
                                        <th className="p-3 text-left font-medium">Nama Siswa</th>
                                        <th className="p-3 text-left font-medium">Kelas</th>
                                        <th className="p-3 text-left font-medium">Tahun Angkatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.student_id} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-3">{student.student_id}</td>
                                            <td className="p-3">{student.nis}</td>
                                            <td className="p-3">{student.nama_siswa}</td>
                                            <td className="p-3">{student.nama_kelas}</td>
                                            <td className="p-3">{student.tahun_angkatan || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
