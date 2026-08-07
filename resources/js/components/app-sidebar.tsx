import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, Hash, LayoutGrid, LayoutTemplate, Users, History, GraduationCap, Briefcase } from 'lucide-react';
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
    SidebarTrigger,
} from '@/components/ui/sidebar';
import users from '@/routes/users';
import students from '@/routes/students';
import teachers from '@/routes/teachers';
import categoryNumbering from '@/routes/category-numbering';
import type { NavItem } from '@/types';
import { dashboard } from '@/routes';
import documents from '@/routes/documents';
import templates from '@/routes/templates';
import headmaster from '@/routes/headmaster';

const platformItems: NavItem[] = [
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
];

const masterDataItems: NavItem[] = [
    {
        title: 'Data Siswa',
        href: students.index(),
        icon: GraduationCap,
        roles: ['SUPERADMIN', 'ADMIN'],
    },
    {
        title: 'Data Guru',
        href: teachers.index(),
        icon: Briefcase,
        roles: ['SUPERADMIN', 'ADMIN'],
    },
    {
        title: 'Kepala Sekolah',
        href: headmaster.index(),
        icon: Users,
        roles: ['SUPERADMIN', 'ADMIN'],
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

const settingsItems: NavItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: users.index(),
        icon: Users,
        roles: ['SUPERADMIN'],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;

    const filterItems = (items: NavItem[]) => {
        return items.filter((item) => {
            if (!item.roles) return true;
            return auth.user?.roles?.some((role) => item.roles?.includes(role));
        });
    };

    const filteredPlatformItems = filterItems(platformItems);
    const filteredMasterDataItems = filterItems(masterDataItems);
    const filteredSettingsItems = filterItems(settingsItems);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarTrigger className="md:hidden" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                {filteredPlatformItems.length > 0 && <NavMain items={filteredPlatformItems} label="Menu Utama" />}
                {filteredMasterDataItems.length > 0 && <NavMain items={filteredMasterDataItems} label="Data Master" />}
                {filteredSettingsItems.length > 0 && <NavMain items={filteredSettingsItems} label="Pengaturan" />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}