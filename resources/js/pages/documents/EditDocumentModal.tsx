import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import documentRoutes from '@/routes/documents';
import { Document } from '@/types/document';

interface Template {
    id: string;
    name: string;
    meta_data: string[];
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: Document | null;
    templates: Template[];
}

export function EditDocumentModal({ open, onOpenChange, document, templates }: Props) {
    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm({
        title: '',
        meta_data_values: {} as Record<string, string>,
        is_draft: false,
    });

    const isDraftRef = useRef(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    useEffect(() => {
        if (open && document) {
            setData({
                title: document.title || '',
                meta_data_values: document.meta_data_values || {},
                is_draft: false,
            });

            const template = templates.find((t) => t.id === document.template_id);
            setSelectedTemplate(template || null);
        } else if (!open) {
            reset();
            clearErrors();
            setSelectedTemplate(null);
        }
    }, [open, document, templates]);

    const handleMetaDataChange = (key: string, value: string) => {
        setData('meta_data_values', {
            ...data.meta_data_values,
            [key]: value,
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!document) return;

        const isDraft = isDraftRef.current;

        transform((currentData) => ({
            ...currentData,
            is_draft: isDraft,
        }));

        put(documentRoutes.update.url(document.id.toString()), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success(isDraft ? 'Draft updated successfully' : 'Document generation started in background');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Draft Document</DialogTitle>
                    <DialogDescription>
                        Modify the document name and metadata. Only draft documents can be edited.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Document Title</Label>
                            <Input
                                id="edit-title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Surat Keterangan Lulus - John Doe"
                            />
                            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                        </div>
                    </div>

                    {selectedTemplate && (
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-medium text-sm">Template Variables ({selectedTemplate.name})</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {(selectedTemplate.meta_data || []).map((key) => (
                                    <div key={key} className="grid gap-2">
                                        <Label htmlFor={`edit-meta-${key}`} className="capitalize">{key.replace(/_/g, ' ')}</Label>
                                        <Input
                                            id={`edit-meta-${key}`}
                                            value={data.meta_data_values[key] || ''}
                                            onChange={(e) => handleMetaDataChange(key, e.target.value)}
                                            placeholder={`Enter ${key}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            onClick={() => { isDraftRef.current = true; }}
                            disabled={processing}
                        >
                            {processing && isDraftRef.current ? 'Saving...' : 'Save as Draft'}
                        </Button>
                        <Button
                            type="submit"
                            onClick={() => { isDraftRef.current = false; }}
                            disabled={processing}
                        >
                            {processing && !isDraftRef.current ? 'Generating...' : 'Generate Document'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
