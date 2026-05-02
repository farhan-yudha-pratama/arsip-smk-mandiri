import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { type User } from '@/types';
import usersRoute from '@/routes/users';

interface Props {
    users: (User & { roles: { name: string }[] })[];
    roles: string[];
}

export default function UserIndex({ users, roles }: Props) {
    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>Manage user roles and permissions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Current Role</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Change Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {users.map((user) => (
                                            <UserRow key={user.id} user={user} roles={roles} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function UserRow({ user, roles }: { user: User & { roles: { name: string }[] }; roles: string[] }) {
    const { patch, processing } = useForm({
        role: user.roles[0]?.name || '',
    });

    const handleRoleChange = (newRole: string) => {
        patch(usersRoute.updateRole(user.id.toString()).url, {
            data: { role: newRole },
            onSuccess: () => toast.success('Role updated successfully'),
        });
    };

    return (
        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <td className="p-4 align-middle font-medium">{user.name}</td>
            <td className="p-4 align-middle">{user.email}</td>
            <td className="p-4 align-middle">
                <Badge variant="outline">{user.roles[0]?.name || 'No Role'}</Badge>
            </td>
            <td className="p-4 align-middle">
                <Select disabled={processing} onValueChange={handleRoleChange} defaultValue={user.roles[0]?.name}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
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
