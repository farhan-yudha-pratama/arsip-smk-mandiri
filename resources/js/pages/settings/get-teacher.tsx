import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { BindukTeacher } from '@/types';

export default function GetTeacher() {
    const [token, setToken] = useState('');
    const [teachers, setTeachers] = useState<BindukTeacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const fetchTeachers = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BINDUK_APP_URL}/api/teacher/active?token=${token}`);
            if (!response.ok) {
                throw new Error('Failed to fetch teachers. Invalid token or server error.');
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                await axios.post('/settings/get-teacher', { teachers: data.data });

                setTeachers(data.data);
                setSuccessMsg(`Berhasil mengambil dan menyimpan ${data.data.length} data guru!`);
                setToken(''); // Bersihkan token setelah berhasil
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setTeachers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Get Teacher" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-medium">Get Teacher Data</h2>
                    <p className="text-sm text-muted-foreground">
                        Fetch active teacher data from the API endpoint using a secure token.
                    </p>
                </div>

                <form onSubmit={fetchTeachers} className="space-y-4">
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
                                {loading ? 'Fetching...' : 'Fetch Teachers'}
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

                {teachers.length > 0 && (
                    <div className="rounded-md border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left font-medium">NIP</th>
                                        <th className="p-3 text-left font-medium">Nama Lengkap</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teachers.map((teacher, index) => (
                                        <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-3">{teacher.nip}</td>
                                            <td className="p-3">{teacher.nama_lengkap}</td>
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
