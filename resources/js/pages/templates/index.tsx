import { Head, useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { Edit, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DialogFooter,
    DialogHeader,
    DialogContent,
    Dialog,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import templateRoutes from '@/routes/templates';

interface Template {
    id: number;
    name: string;
    url: string;
    meta_data: {
        category?: string;
        description?: string;
        [key: string]: any;
    };
    created_at: string;
}

interface Props {
    templates: Template[];
}

export default function Templates({ templates = [] }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(
        null,
    );
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
        null,
    );
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            title: '',
            category: '',
            description: '',
            document: '',
        });

    const { delete: destroy, processing: deleting } = useForm();

    const openCreateModal = () => {
        setEditingTemplate(null);
        setData({
            title: '',
            category: '',
            description: '',
            document: '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (template) => {
        setEditingTemplate(template);
        setData({
            title: template.name,
            category: template.meta_data?.category || '',
            description: template.meta_data?.description || '',
            document: '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (template) => {
        setTemplateToDelete(template);
        setIsDeleteModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size exceeds 5MB limit');
                e.target.value = null;

                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setData('document', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingTemplate) {
            post(templateRoutes.update.url(editingTemplate.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Template updated successfully');
                },
            });
        } else {
            post(templateRoutes.store.url(), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    toast.success('Template created successfully');
                },
            });
        }
    };

    const handleDelete = () => {
        if (!templateToDelete) {
            return;
        }

        destroy(templateRoutes.destroy.url(templateToDelete.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setTemplateToDelete(null);
                toast.success('Template deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete template');
            },
        });
    };

    const filteredTemplates = templates.filter(
        (t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.meta_data?.category
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Templates Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Templates
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your document templates and metadata.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Template
                    </Button>
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="flex-1 bg-transparent text-sm outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Category
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Description
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Uploaded At
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        Actions
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
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none">
                                                    {template.meta_data
                                                        ?.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="max-w-50 truncate p-4 align-middle text-muted-foreground">
                                                {template.meta_data
                                                    ?.description || '-'}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(
                                                    template.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right align-middle">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEditModal(
                                                                template,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
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
                                            colSpan={5}
                                            className="h-24 text-center align-middle text-muted-foreground"
                                        >
                                            No templates found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingTemplate
                                ? 'Edit Template'
                                : 'Add New Template'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTemplate
                                ? 'Update template metadata.'
                                : 'Upload a new DOCX template and define its category.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Template Name</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="e.g. Surat Keterangan Lulus"
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                placeholder="e.g. Akademik, Tata Usaha"
                            />
                            {errors.category && (
                                <p className="text-xs text-destructive">
                                    {errors.category}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Description (Optional)
                            </Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Brief description of the template"
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                        {!editingTemplate && (
                            <div className="grid gap-2">
                                <Label htmlFor="document">
                                    Template File (DOCX)
                                </Label>
                                <Input
                                    id="document"
                                    type="file"
                                    accept=".docx"
                                    onChange={handleFileChange}
                                />
                                {errors.document && (
                                    <p className="text-xs text-destructive">
                                        {errors.document}
                                    </p>
                                )}
                            </div>
                        )}
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingTemplate ? 'Update' : 'Create'} Template
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the template
                            <span className="font-semibold text-foreground">
                                {' '}
                                {templateToDelete?.name}{' '}
                            </span>
                            and remove the file from storage.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete Template'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
