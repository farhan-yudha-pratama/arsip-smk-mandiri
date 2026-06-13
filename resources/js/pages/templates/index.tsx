import { Head, useForm, router } from '@inertiajs/react';
import {
    Download,
    Edit,
    Eye,
    FileText,
    Plus,
    Search,
    Trash2,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DialogFooter,
    DialogHeader,
    DialogContent,
    Dialog,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import templateRoutes from '@/routes/templates';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import TemplateModal from './TemplateModal';
import { Template } from '@/types/template';
import { formatDateTime } from '@/lib/utils';
import { Pagination } from '@/components/Pagination';

interface Props {
    templates: { data: Template[]; links: any[] };
    filters: any;
}

export default function Templates({ templates = { data: [], links: [] }, filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(
        null,
    );
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
        null,
    );
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const { delete: destroy, processing: deleting } = useForm();

    const openCreateModal = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const openDeleteModal = (template: Template) => {
        setTemplateToDelete(template);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!templateToDelete) {
            return;
        }

        destroy(templateRoutes.destroy.url(templateToDelete.id.toString()), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setTemplateToDelete(null);
                toast.success('Suskes menghapus template');
            },
            onError: () => {
                toast.error('Gagal menghapus template');
            },
        });
    };

    const filteredTemplates = templates.data;

    return (
        <>
            <Head title="Template Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Template
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola template dokumen.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Template
                    </Button>
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari Template."
                        className="flex-1 bg-transparent text-sm outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get(templateRoutes.index.url(), { search: searchTerm }, { preserveState: true, replace: true });
                            }
                        }}
                    />
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        {/* Mobile View (Cards) */}
                        <div className="block md:hidden p-4 bg-muted/20">
                            {filteredTemplates.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {filteredTemplates.map((template) => (
                                        <div key={template.id} className="flex flex-col gap-3 p-4 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-start gap-2">
                                                    <div className="bg-blue-100 p-2 rounded-lg shrink-0 dark:bg-blue-900/30">
                                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm line-clamp-2 mt-0.5">{template.name}</span>
                                                        <span className="text-[10px] text-muted-foreground mt-0.5">{formatDateTime(template.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2 mt-1">
                                                <span className="text-xs font-medium text-muted-foreground">Variabel:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {(Array.isArray(template.meta_data) ? template.meta_data : []).length > 0 ? (
                                                        (template.meta_data as string[]).map((p: string) => (
                                                            <Badge
                                                                key={p}
                                                                variant="outline"
                                                                className="px-1.5 py-0.5 text-[10px] uppercase bg-muted/50"
                                                            >
                                                                {p}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            Tidak ada variabel
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-end mt-1 pt-3 border-t">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <a href={templateRoutes.download.url(template.id.toString())}>
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => openDeleteModal(template)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground bg-card rounded-xl border border-dashed">
                                    Tidak template ditemukan.
                                </div>
                            )}
                        </div>

                        {/* Desktop View (Table) */}
                        <table className="hidden md:table w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Nama
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[300px]">
                                        Variabel
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Diunggah pada
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTemplates.length > 0 ? (
                                    filteredTemplates.map((template) => (
                                        <tr
                                            key={template.id}
                                            className="border-b transition-colors hover:bg-muted/30"
                                        >
                                            <td className="p-4 align-middle font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                    {template.name}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle w-[300px]">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex gap-1 overflow-hidden whitespace-nowrap max-w-[280px]">
                                                            {(Array.isArray(template.meta_data)
                                                                ? template.meta_data
                                                                : []
                                                            ).length > 0 ? (
                                                                (template.meta_data as string[]).map((p: string) => (
                                                                    <Badge
                                                                        key={p}
                                                                        variant="outline"
                                                                        className="px-1 py-0 text-[10px] uppercase flex-shrink-0"
                                                                    >
                                                                        {p}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Tidak ada variabel
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TooltipTrigger>
                                                    {(Array.isArray(template.meta_data) && template.meta_data.length > 0) && (
                                                        <TooltipContent className="flex flex-wrap gap-1 max-w-[300px]">
                                                            {(template.meta_data as string[]).map((p: string) => (
                                                                <Badge
                                                                    key={p}
                                                                    variant="outline"
                                                                    className="px-1 py-0 text-[10px] uppercase"
                                                                >
                                                                    {p}
                                                                </Badge>
                                                            ))}
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {formatDateTime(template.created_at)}
                                            </td>
                                            <td className="p-4 text-right align-middle">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <a
                                                            href={templateRoutes.download.url(
                                                                template.id.toString(),
                                                            )}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                template,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="h-24 text-center align-middle text-muted-foreground"
                                        >
                                            Tidak template ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t flex justify-end">
                        <Pagination links={templates.links} />
                    </div>
                </div>
            </div>

            <TemplateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingTemplate={editingTemplate}
            />

            <Dialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Hal ini akan menghapus
                            templat secara permanen
                            <span className="font-semibold text-foreground">
                                {' '}
                                {templateToDelete?.name}{' '}
                            </span>
                            dan hapus berkas tersebut dari penyimpanan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {deleting ? 'Sedang Menghapus...' : 'Hapus Template'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}