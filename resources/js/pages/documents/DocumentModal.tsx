import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { toast } from 'sonner';
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
import { SearchableSelect } from '@/components/SearchableSelect';
import { X } from 'lucide-react';
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
                toast.success(isDraft ? 'Dokumen disimpan sebagai draf' : 'Pembuatan dokumen dimulai di latar belakang');
            },
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-background w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border animate-in zoom-in-95 duration-200"
                style={{ height: 'auto', maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Buat Dokumen</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Pilih template dan lengkapi informasi yang dibutuhkan untuk membuat dokumen.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="create-document-form" className="space-y-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="template" className="text-sm font-semibold">Template</Label>
                                <Select
                                    value={data.template_id}
                                    onValueChange={(value) => setData('template_id', value)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Pilih template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.template_id && <p className="text-xs font-medium text-destructive">{errors.template_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-semibold">Judul Dokumen</Label>
                                <Input
                                    id="title"
                                    className="h-11"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="contoh: Surat Keterangan Lulus - John Doe"
                                />
                                {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="recipient_type" className="text-sm font-semibold">Tipe Penerima</Label>
                                <Select
                                    value={data.recipient_type}
                                    onValueChange={(value) => setData('recipient_type', value)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Pilih tipe penerima" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STUDENT">Siswa</SelectItem>
                                        <SelectItem value="TEACHER">Guru</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.recipient_type && <p className="text-xs font-medium text-destructive">{errors.recipient_type}</p>}
                            </div>

                            {data.recipient_type === 'STUDENT' && (
                                <div className="space-y-2">
                                    <Label htmlFor="student" className="text-sm font-semibold">Siswa</Label>
                                    <SearchableSelect
                                        options={students.map(s => ({ label: `${s.name} (${s.nis})`, value: s.id }))}
                                        value={data.student_id}
                                        onChange={(value) => setData('student_id', value)}
                                        placeholder="Pilih Siswa"
                                        className="h-11"
                                    />
                                    {errors.student_id && <p className="text-xs font-medium text-destructive">{errors.student_id}</p>}
                                </div>
                            )}

                            {data.recipient_type === 'TEACHER' && (
                                <div className="space-y-2">
                                    <Label htmlFor="teacher" className="text-sm font-semibold">Guru</Label>
                                    <SearchableSelect
                                        options={teachers.map(t => ({ label: `${t.name} (${t.nip})`, value: t.id }))}
                                        value={data.teacher_id}
                                        onChange={(value) => setData('teacher_id', value)}
                                        placeholder="Pilih Guru"
                                        className="h-11"
                                    />
                                    {errors.teacher_id && <p className="text-xs font-medium text-destructive">{errors.teacher_id}</p>}
                                </div>
                            )}
                        </div>

                        {selectedTemplate && (
                            <div className="space-y-4 rounded-xl border bg-muted/20 p-5">
                                <h3 className="font-bold text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                                    Variabel Template
                                </h3>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {(selectedTemplate.meta_data || []).map((key) => {
                                        const cleanKey = key.replace(/[{}]/g, '');

                                        // Match nama-siswa[number] or nama-murid[number]
                                        const studentMatch = cleanKey.match(/^(nama-siswa|nama-murid)(\d*)$/);
                                        const isStudentKey = !!studentMatch;

                                        // Match nama-guru[number]
                                        const teacherMatch = cleanKey.match(/^nama-guru(\d*)$/);
                                        const isTeacherKey = !!teacherMatch;

                                        return (
                                            <div key={key} className="space-y-2">
                                                <Label htmlFor={`meta-${key}`} className="capitalize text-sm font-medium">
                                                    {key.replace(/_/g, ' ')}
                                                </Label>
                                                {isStudentKey ? (
                                                    <SearchableSelect
                                                        options={students.map(s => ({ label: `${s.name} (${s.nis})`, value: s.name }))}
                                                        value={data.meta_data_values[key] || ''}
                                                        onChange={(value) => handleMetaDataChange(key, value)}
                                                        placeholder="Pilih Siswa"
                                                    />
                                                ) : isTeacherKey ? (
                                                    <SearchableSelect
                                                        options={teachers.map(t => ({ label: `${t.name} (${t.nip})`, value: t.name }))}
                                                        value={data.meta_data_values[key] || ''}
                                                        onChange={(value) => handleMetaDataChange(key, value)}
                                                        placeholder="Pilih Guru"
                                                    />
                                                ) : (
                                                    <Input
                                                        id={`meta-${key}`}
                                                        className="h-10"
                                                        value={data.meta_data_values[key] || ''}
                                                        onChange={(e) => handleMetaDataChange(key, e.target.value)}
                                                        placeholder={`Masukkan ${key}`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        form="create-document-form"
                        variant="secondary"
                        onClick={() => { isDraftRef.current = true; }}
                        disabled={processing || !data.template_id}
                    >
                        {processing && isDraftRef.current ? 'Menyimpan...' : 'Simpan Draf'}
                    </Button>
                    <Button
                        type="submit"
                        form="create-document-form"
                        onClick={() => { isDraftRef.current = false; }}
                        disabled={processing || !data.template_id}
                        className="min-w-[140px]"
                    >
                        {processing && !isDraftRef.current ? 'Membuat...' : 'Buat Dokumen'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
