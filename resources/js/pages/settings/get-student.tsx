import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';

interface Student {
    id: number;
    nis: string;
    nisn: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    alamat: string;
    class?: {
        name: string;
    };
}

export default function GetStudent() {
    const [token, setToken] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const fetchStudents = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BINDUK_APP_URL}/api/students?token=${token}`);
            if (!response.ok) {
                throw new Error('Failed to fetch students. Invalid token or server error.');
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                // Save to local database
                await axios.post('/settings/get-student', { students: data.data });

                setStudents(data.data);
                setSuccessMsg(`Berhasil mengambil dan menyimpan ${data.data.length} data siswa!`);
                setToken(''); // Bersihkan token setelah berhasil
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
            <Head title="Get Student" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-medium">Get Student Data</h2>
                    <p className="text-sm text-muted-foreground">
                        Fetch student data from the API endpoint using a secure token.
                    </p>
                </div>

                <form onSubmit={fetchStudents} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="token">API Token</Label>
                        <div className="flex gap-2">
                            <Input
                                id="token"
                                value={token}
                                onChange={(e) => {
                                    setToken(e.target.value);
                                    if (successMsg) setSuccessMsg(null);
                                    if (error) setError(null);
                                }}
                                placeholder="Enter API Token"
                                className="max-w-md"
                                required
                            />
                            <Button type="submit" disabled={loading || token.trim().length === 0}>
                                {loading ? 'Fetching...' : 'Fetch Students'}
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
                    <div className="rounded-md border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left font-medium">NIS</th>
                                        <th className="p-3 text-left font-medium">NISN</th>
                                        <th className="p-3 text-left font-medium">Name</th>
                                        <th className="p-3 text-left font-medium">Gender</th>
                                        <th className="p-3 text-left font-medium">Class</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-3">{student.nis}</td>
                                            <td className="p-3">{student.nisn}</td>
                                            <td className="p-3">{student.nama_lengkap}</td>
                                            <td className="p-3">{student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                            <td className="p-3">{student.class?.name || '-'}</td>
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
