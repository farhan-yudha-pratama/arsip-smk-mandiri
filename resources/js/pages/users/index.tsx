import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { type User } from '@/types';
import usersRoute from '@/routes/users';
import { Pagination } from '@/components/Pagination';

interface Props {
    users: { data: (User & { roles: { name: string }[] })[]; links: any[] };
    roles: string[];
    filters: any;
}

export default function UserIndex({ users, roles }: Props) {
    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengguna</CardTitle>
                            <CardDescription>Kelola peran dan hak akses pengguna.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="relative w-full">
                                {/* Mobile View (Cards) */}
                                <div className="block md:hidden">
                                    <div className="flex flex-col gap-4">
                                        {users.data.map((user) => (
                                            <UserCard key={user.id} user={user} roles={roles} />
                                        ))}
                                    </div>
                                </div>

                                {/* Desktop View (Table) */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Peran Saat Ini</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ubah Peran</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {users.data.map((user) => (
                                                <UserRow key={user.id} user={user} roles={roles} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Pagination links={users.links} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function UserCard({ user, roles }: { user: User & { roles: { name: string }[] }; roles: string[] }) {
    const [processing, setProcessing] = useState(false);

    const handleRoleChange = (newRole: string) => {
        router.patch(usersRoute.updateRole(user.id.toString()).url, { role: newRole }, {
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => toast.success('Peran berhasil diperbarui'),
        });
    };

    const handleStatusChange = (status: string) => {
        router.patch(usersRoute.updateStatus(user.id.toString()).url, { is_active: status === 'true' }, {
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => toast.success('Status berhasil diperbarui'),
        });
    };

    const handleDelete = () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.name}?`)) return;
        router.delete(usersRoute.destroy(user.id.toString()).url, {
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => toast.success('Pengguna berhasil dihapus'),
            onError: (errs: any) => {
                toast.error(errs?.error || 'Gagal menghapus pengguna');
            }
        });
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md opacity-100 data-[inactive=true]:opacity-75" data-inactive={!user.is_active}>
            <div className="flex flex-col gap-1">
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium">Peran Saat Ini</span>
                    <div>
                        <Badge variant="outline" className="bg-muted/50">{user.roles[0]?.name || 'Tanpa Peran'}</Badge>
                    </div>
                </div>
            </div>

            <div className="mt-2 pt-3 border-t grid grid-cols-2 gap-3">
                <div>
                    <span className="text-xs text-muted-foreground font-medium block mb-2">Ubah Peran</span>
                    <Select disabled={processing} onValueChange={handleRoleChange} defaultValue={user.roles[0]?.name}>
                        <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder="Pilih peran" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <span className="text-xs text-muted-foreground font-medium block mb-2">Status</span>
                    <Select disabled={processing} onValueChange={handleStatusChange} defaultValue={user.is_active ? 'true' : 'false'}>
                        <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Aktif</SelectItem>
                            <SelectItem value="false">Tidak Aktif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {!user.is_active && (
                <div className="mt-1 pt-2 border-t flex justify-end">
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={processing}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus Pengguna
                    </Button>
                </div>
            )}
        </div>
    );
}

function UserRow({ user, roles }: { user: User & { roles: { name: string }[] }; roles: string[] }) {
    const [processing, setProcessing] = useState(false);

    const handleRoleChange = (newRole: string) => {
        router.patch(usersRoute.updateRole(user.id.toString()).url, { role: newRole }, {
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => toast.success('Peran berhasil diperbarui'),
        });
    };

    const handleStatusChange = (status: string) => {
        router.patch(usersRoute.updateStatus(user.id.toString()).url, { is_active: status === 'true' }, {
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => toast.success('Status berhasil diperbarui'),
        });
    };

    const handleDelete = () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.name}?`)) return;
        router.delete(usersRoute.destroy(user.id.toString()).url, {
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => toast.success('Pengguna berhasil dihapus'),
            onError: (errs: any) => {
                toast.error(errs?.error || 'Gagal menghapus pengguna');
            }
        });
    };

    return (
        <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${!user.is_active ? 'opacity-75 bg-muted/20' : ''}`}>
            <td className="p-4 align-middle font-medium">{user.name}</td>
            <td className="p-4 align-middle">{user.email}</td>
            <td className="p-4 align-middle">
                <Badge variant="outline">{user.roles[0]?.name || 'Tanpa Peran'}</Badge>
            </td>
            <td className="p-4 align-middle">
                <Select disabled={processing} onValueChange={handleRoleChange} defaultValue={user.roles[0]?.name}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>
            <td className="p-4 align-middle">
                <Select disabled={processing} onValueChange={handleStatusChange} defaultValue={user.is_active ? 'true' : 'false'}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Tidak Aktif</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="p-4 align-middle text-center">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10" 
                    disabled={user.is_active || processing}
                    onClick={handleDelete}
                    title={user.is_active ? "Nonaktifkan pengguna terlebih dahulu untuk menghapus" : "Hapus pengguna"}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </td>
        </tr>
    );
}

UserIndex.layout = {
    breadcrumbs: [
        {
            title: 'User Management',
            href: usersRoute.index().url,
        },
    ],
};
