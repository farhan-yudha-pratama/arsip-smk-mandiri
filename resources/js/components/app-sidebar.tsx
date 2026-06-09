import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, Hash, LayoutGrid, LayoutTemplate, Users, History } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import users from '@/routes/users';
import categoryNumbering from '@/routes/category-numbering';
import type { NavItem } from '@/types';
import { dashboard } from '@/routes';
import documents from '@/routes/documents';
import templates from '@/routes/templates';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Laporan Arsip',
        href: '/laporan-arsip',
        icon: History,
        roles: ['SUPERADMIN', 'ADMIN', 'OPERATOR'],
    },
    {
        title: 'Surat Masuk',
        href: documents.incoming.index(),
        icon: BookOpen,
        roles: ['SUPERADMIN', 'ADMIN', 'OPERATOR'],
    },
    {
        title: 'Surat Keluar',
        href: documents.outgoing.index(),
        icon: BookOpen,
        roles: ['SUPERADMIN', 'ADMIN', 'OPERATOR'],
    },

    {
        title: 'Manajemen Pengguna',
        href: users.index(),
        icon: Users,
        roles: ['SUPERADMIN'],
    },

    {
        title: 'Templates',
        href: templates.index(),
        icon: LayoutTemplate,
        roles: ['SUPERADMIN', 'ADMIN'],
    },

    {
        title: 'Kategori Penomoran',
        href: categoryNumbering.index(),
        icon: Hash,
        roles: ['SUPERADMIN', 'ADMIN'],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;

    const filteredNavItems = mainNavItems.filter((item) => {
        if (!item.roles) return true;
        return auth.user?.roles?.some((role) => item.roles?.includes(role));
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}