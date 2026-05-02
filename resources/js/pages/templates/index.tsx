import { Head, useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import {
    Download,
    Edit,
    Eye,
    FileText,
    Plus,
    Search,
    Trash2,
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
            document: '',
            metadata: [] as string[],
        });

    const { delete: destroy, processing: deleting } = useForm();

    const openCreateModal = () => {
        setEditingTemplate(null);
        setData({
            title: '',
            document: '',
            metadata: [],
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (template: Template) => {
        setEditingTemplate(template);
        setData({
            title: template.name,
            document: '',
            metadata: (Array.isArray(template.meta_data) ? template.meta_data : []) as string[],
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (template: Template) => {
        setTemplateToDelete(template);
        setIsDeleteModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size exceeds 5MB limit');
                e.target.value = '';

                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setData('document', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const [newMetadataKey, setNewMetadataKey] = useState('');

    const addMetadataKey = () => {
        if (newMetadataKey && !data.metadata.includes(newMetadataKey)) {
            setData('metadata', [...data.metadata, newMetadataKey]);
            setNewMetadataKey('');
        }
    };

    const removeMetadataKey = (key: string) => {
        setData(
            'metadata',
            data.metadata.filter((k) => k !== key),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTemplate) {
            post(templateRoutes.update.url(editingTemplate.id.toString()), {
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

        destroy(templateRoutes.destroy.url(templateToDelete.id.toString()), {
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

    const filteredTemplates = templates.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
                                        Variables
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
                                                <div className="flex flex-wrap gap-1">
                                                    {(Array.isArray(template.meta_data)
                                                        ? template.meta_data
                                                        : []
                                                    ).map((p: string) => (
                                                            <Badge
                                                                key={p}
                                                                variant="outline"
                                                                className="px-1 py-0 text-[10px] uppercase"
                                                            >
                                                                {p}
                                                            </Badge>
                                                        ),
                                                    ) || (
                                                        <span className="text-xs text-muted-foreground">
                                                            No variables
                                                        </span>
                                                    )}
                                                </div>
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
                                                        asChild
                                                    >
                                                        <a
                                                            href={templateRoutes.preview.url(
                                                                template.id.toString(),
                                                            )}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>
                                                    </Button>
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
                            <Label>Metadata Fields (Placeholders)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newMetadataKey}
                                    onChange={(e) =>
                                        setNewMetadataKey(e.target.value)
                                    }
                                    placeholder="e.g. name, date, address"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addMetadataKey();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addMetadataKey}
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {data.metadata.map((key) => (
                                    <Badge
                                        key={key}
                                        variant="secondary"
                                        className="flex items-center gap-1 px-2 py-1"
                                    >
                                        {key}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeMetadataKey(key)
                                            }
                                            className="ml-1 rounded-full hover:bg-muted"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Add keys that will be used as placeholders in
                                the document (e.g. name for {'{{name}}'})
                            </p>
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
