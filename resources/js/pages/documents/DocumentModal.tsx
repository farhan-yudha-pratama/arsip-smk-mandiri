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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import documentRoutes from '@/routes/documents';

interface Template {
    id: string;
    name: string;
    meta_data: string[];
}

interface Student {
    id: string;
    name: string;
    nis: string;
}

interface Teacher {
    id: string;
    name: string;
    nip: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templates: Template[];
    students: Student[];
    teachers: Teacher[];
}

export function CreateDocumentModal({ open, onOpenChange, templates, students, teachers }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        template_id: '',
        title: '',
        recipient_type: 'STUDENT',
        student_id: '',
        teacher_id: '',
        meta_data_values: {} as Record<string, string>,
        is_draft: false,
    });

    const isDraftRef = useRef(false);

    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    useEffect(() => {
        if (data.template_id) {
            const template = templates.find((t) => t.id === data.template_id);
            setSelectedTemplate(template || null);

            // Initialize meta_data_values with empty strings for each placeholder
            if (template) {
                const initialValues: Record<string, string> = {};
                (template.meta_data || []).forEach((key) => {
                    initialValues[key] = '';
                });
                setData('meta_data_values', initialValues);
            }
        }
    }, [data.template_id, templates]);

    const handleMetaDataChange = (key: string, value: string) => {
        setData('meta_data_values', {
            ...data.meta_data_values,
            [key]: value,
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const isDraft = isDraftRef.current;

        transform((currentData) => ({
            ...currentData,
            is_draft: isDraft,
        }));

        post(documentRoutes.store.url(), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success(isDraft ? 'Document saved as draft' : 'Document generation started in background');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generate Document</DialogTitle>
                    <DialogDescription>
                        Select a template and fill in the required information to generate a document.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="template">Template</Label>
                            <Select
                                value={data.template_id}
                                onValueChange={(value) => setData('template_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.template_id && <p className="text-xs text-destructive">{errors.template_id}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Document Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Surat Keterangan Lulus - John Doe"
                            />
                            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="recipient_type">Recipient Type</Label>
                            <Select
                                value={data.recipient_type}
                                onValueChange={(value) => setData('recipient_type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select recipient type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                    <SelectItem value="TEACHER">Teacher</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.recipient_type && <p className="text-xs text-destructive">{errors.recipient_type}</p>}
                        </div>

                        {data.recipient_type === 'STUDENT' && (
                            <div className="grid gap-2">
                                <Label htmlFor="student">Student</Label>
                                <Select
                                    value={data.student_id}
                                    onValueChange={(value) => setData('student_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name} ({s.nis})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.student_id && <p className="text-xs text-destructive">{errors.student_id}</p>}
                            </div>
                        )}

                        {data.recipient_type === 'TEACHER' && (
                            <div className="grid gap-2">
                                <Label htmlFor="teacher">Teacher</Label>
                                <Select
                                    value={data.teacher_id}
                                    onValueChange={(value) => setData('teacher_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name} ({t.nip})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && <p className="text-xs text-destructive">{errors.teacher_id}</p>}
                            </div>
                        )}
                    </div>

                    {selectedTemplate && (
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-medium text-sm">Template Variables</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {(selectedTemplate.meta_data || []).map((key) => (
                                    <div key={key} className="grid gap-2">
                                        <Label htmlFor={`meta-${key}`} className="capitalize">{key.replace(/_/g, ' ')}</Label>
                                        <Input
                                            id={`meta-${key}`}
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
                            disabled={processing || !data.template_id}
                        >
                            {processing && isDraftRef.current ? 'Saving...' : 'Save as Draft'}
                        </Button>
                        <Button 
                            type="submit" 
                            onClick={() => { isDraftRef.current = false; }}
                            disabled={processing || !data.template_id}
                        >
                            {processing && !isDraftRef.current ? 'Generating...' : 'Generate Document'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
