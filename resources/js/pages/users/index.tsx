import { Head, useForm } from '@inertiajs/react';
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
    const { patch, processing } = useForm({
        role: user.roles[0]?.name || '',
    });

    const handleRoleChange = (newRole: string) => {
        patch(usersRoute.updateRole(user.id.toString()).url, {
            data: { role: newRole },
            onSuccess: () => toast.success('Peran berhasil diperbarui'),
        });
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
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

            <div className="mt-2 pt-3 border-t">
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
        </div>
    );
}

function UserRow({ user, roles }: { user: User & { roles: { name: string }[] }; roles: string[] }) {
    const { patch, processing } = useForm({
        role: user.roles[0]?.name || '',
    });

    const handleRoleChange = (newRole: string) => {
        patch(usersRoute.updateRole(user.id.toString()).url, {
            data: { role: newRole },
            onSuccess: () => toast.success('Peran berhasil diperbarui'),
        });
    };

    return (
        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
