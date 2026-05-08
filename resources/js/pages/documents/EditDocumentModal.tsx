import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/SearchableSelect';
import { X } from 'lucide-react';
import { cn, formatIndonesianDate, formatIndonesianDateTime, formatIndonesianTime, parseIndonesianDate, parseIndonesianDateTime } from '@/lib/utils';
import documentRoutes from '@/routes/documents';
import { Document } from '@/types/document';
import { Template } from '@/types/template';
import { CategoryNumbering } from '@/types/category-numbering';
import { Student, Teacher } from '@/types/user';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: Document | null;
    templates: Template[];
    students: Student[];
    teachers: Teacher[];
    categoryNumberings: CategoryNumbering[];
}

export function EditDocumentModal({ open, onOpenChange, document, templates, students, teachers, categoryNumberings = [] }: Props) {
    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm({
        title: '',
        meta_data_values: {} as Record<string, string>,
        category_numbering_id: '' as string | number,
        is_draft: false,
        recipient_name: '',
    });

    const isDraftRef = useRef(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    useEffect(() => {
        if (open && document) {
            setData({
                title: document.title || '',
                meta_data_values: document.meta_data_values || {},
                category_numbering_id: document.category_numbering_id || '',
                is_draft: false,
                recipient_name: document.recipient_type || '',
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
                        <h2 className="text-xl font-bold tracking-tight">Edit Draft Document</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Modify the document name and metadata. Only draft documents can be edited.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="edit-document-form" className="space-y-8">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title" className="text-sm font-semibold">Document Title</Label>
                                <Input
                                    id="edit-title"
                                    className="h-11"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Surat Keterangan Lulus - John Doe"
                                />
                                {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
                            </div>

                            {document?.recipient_type === 'EXTERNAL' && (
                                <div className="space-y-2">
                                    <Label htmlFor="edit-recipient-name" className="text-sm font-semibold">Recipient Name (External)</Label>
                                    <Input
                                        id="edit-recipient-name"
                                        className="h-11"
                                        value={data.recipient_name}
                                        onChange={(e) => setData('recipient_name', e.target.value)}
                                        placeholder="e.g. PT. Contoh Indonesia"
                                    />
                                    {errors.recipient_name && <p className="text-xs font-medium text-destructive">{errors.recipient_name}</p>}
                                </div>
                            )}
                        </div>

                        {selectedTemplate && (
                            <div className="space-y-4 rounded-xl border bg-muted/20 p-5">
                                <h3 className="font-bold text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                                    Template Variables ({selectedTemplate.name})
                                </h3>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {(Array.isArray(selectedTemplate.meta_data) ? selectedTemplate.meta_data : []).map((key: string) => {
                                        const cleanKey = key.replace(/[{}]/g, '');

                                        const studentMatch = cleanKey.match(/^(nama-siswa|nama-murid)(\d*)$/);
                                        const isStudentKey = !!studentMatch;

                                        const teacherMatch = cleanKey.match(/^nama-guru(\d*)$/);
                                        const isTeacherKey = !!teacherMatch;

                                        return (
                                            <div key={key} className="space-y-2">
                                                <Label htmlFor={`edit-meta-${key}`} className="capitalize text-sm font-medium">
                                                    {key.replace(/_/g, ' ')}
                                                </Label>
                                                {isStudentKey ? (
                                                    <SearchableSelect
                                                        options={students.map(s => ({ label: `${s.name} (${s.nis})`, value: s.name }))}
                                                        value={data.meta_data_values[key] || ''}
                                                        onChange={(value) => handleMetaDataChange(key, value)}
                                                        placeholder="Select student"
                                                    />
                                                ) : isTeacherKey ? (
                                                    <SearchableSelect
                                                        options={teachers.map(t => ({ label: `${t.name} (${t.nip})`, value: t.name }))}
                                                        value={data.meta_data_values[key] || ''}
                                                        onChange={(value) => handleMetaDataChange(key, value)}
                                                        placeholder="Select teacher"
                                                    />
                                                ) : cleanKey === 'nomor-surat' ? (
                                                    <SearchableSelect
                                                        options={categoryNumberings.map(c => ({
                                                            label: `${c.name_numbering_document} (${c.letter_code})`,
                                                            value: c.id.toString()
                                                        }))}
                                                        value={data.category_numbering_id.toString()}
                                                        onChange={(value) => {
                                                            const category = categoryNumberings.find(c => c.id.toString() === value);
                                                            if (category) {
                                                                setData(prev => ({
                                                                    ...prev,
                                                                    category_numbering_id: category.id,
                                                                    meta_data_values: {
                                                                        ...prev.meta_data_values,
                                                                        [key]: (function () {
                                                                            const now = new Date();
                                                                            const monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
                                                                            return category.format_pattern
                                                                                .replace('{nomor_urut}', '[AUTO]')
                                                                                .replace('{kode}', category.letter_code)
                                                                                .replace('{instansi}', 'SMK-M')
                                                                                .replace('{bulan_romawi}', monthRomawi[now.getMonth()])
                                                                                .replace('{tahun}', now.getFullYear().toString());
                                                                        })()
                                                                    }
                                                                }));
                                                            }
                                                        }}
                                                        placeholder="Pilih Kategori Penomoran"
                                                    />
                                                ) : key.includes('T_jadwal_start_end_waktu') ? (
                                                    <div className="flex flex-col gap-2">
                                                        <Input
                                                            type="datetime-local"
                                                            className="h-10 rounded-lg"
                                                            value={parseIndonesianDateTime((data.meta_data_values[key] || '').split(' s/d ')[0])}
                                                            onChange={(e) => {
                                                                const end = (data.meta_data_values[key] || '').split(' s/d ')[1] || '';
                                                                handleMetaDataChange(key, `${formatIndonesianDateTime(e.target.value)}${end ? ` s/d ${end}` : ''}`);
                                                            }}
                                                        />
                                                        <div className="text-[10px] text-center text-muted-foreground font-bold">s/d</div>
                                                        <Input
                                                            type="datetime-local"
                                                            className="h-10 rounded-lg"
                                                            value={parseIndonesianDateTime((data.meta_data_values[key] || '').split(' s/d ')[1])}
                                                            onChange={(e) => {
                                                                const start = (data.meta_data_values[key] || '').split(' s/d ')[0] || '';
                                                                handleMetaDataChange(key, `${start}${start ? ` s/d ` : ''}${formatIndonesianDateTime(e.target.value)}`);
                                                            }}
                                                        />
                                                        <p className="text-[10px] font-medium text-primary mt-1 truncate">{data.meta_data_values[key]}</p>
                                                    </div>
                                                ) : key.includes('T_jadwal_start_end_date') ? (
                                                    <div className="flex flex-col gap-2">
                                                        <Input
                                                            type="date"
                                                            className="h-10 rounded-lg"
                                                            value={parseIndonesianDate((data.meta_data_values[key] || '').split(' s/d ')[0])}
                                                            onChange={(e) => {
                                                                const end = (data.meta_data_values[key] || '').split(' s/d ')[1] || '';
                                                                handleMetaDataChange(key, `${formatIndonesianDate(e.target.value)}${end ? ` s/d ${end}` : ''}`);
                                                            }}
                                                        />
                                                        <div className="text-[10px] text-center text-muted-foreground font-bold">s/d</div>
                                                        <Input
                                                            type="date"
                                                            className="h-10 rounded-lg"
                                                            value={parseIndonesianDate((data.meta_data_values[key] || '').split(' s/d ')[1])}
                                                            onChange={(e) => {
                                                                const start = (data.meta_data_values[key] || '').split(' s/d ')[0] || '';
                                                                handleMetaDataChange(key, `${start}${start ? ` s/d ` : ''}${formatIndonesianDate(e.target.value)}`);
                                                            }}
                                                        />
                                                        <p className="text-[10px] font-medium text-primary mt-1 truncate">{data.meta_data_values[key]}</p>
                                                    </div>
                                                ) : key.includes('T_jadwal_waktu') ? (
                                                    <div className="space-y-1">
                                                        <Input
                                                            type="datetime-local"
                                                            className="h-10 rounded-lg"
                                                            value={parseIndonesianDateTime(data.meta_data_values[key] || '')}
                                                            onChange={(e) => handleMetaDataChange(key, formatIndonesianDateTime(e.target.value))}
                                                        />
                                                        <p className="text-[10px] font-medium text-primary truncate">{data.meta_data_values[key]}</p>
                                                    </div>
                                                ) : key.includes('T_jadwal_date') || key.includes('tanggal') ? (
                                                    <div className="space-y-1">
                                                        <Input
                                                            type="date"
                                                            className="h-10 rounded-lg"
                                                            value={parseIndonesianDate(data.meta_data_values[key] || '')}
                                                            onChange={(e) => handleMetaDataChange(key, formatIndonesianDate(e.target.value))}
                                                        />
                                                        <p className="text-[10px] font-medium text-primary truncate">{data.meta_data_values[key]}</p>
                                                    </div>
                                                ) : key.includes('waktu') ? (
                                                    <div className="space-y-1">
                                                        <Input
                                                            type="time"
                                                            className="h-10 rounded-lg"
                                                            value={data.meta_data_values[key] || ''}
                                                            onChange={(e) => handleMetaDataChange(key, formatIndonesianTime(`2000-01-01T${e.target.value}`))}
                                                        />
                                                        <p className="text-[10px] font-medium text-primary truncate">{data.meta_data_values[key]}</p>
                                                    </div>
                                                ) : (

                                                    <Input
                                                        id={`edit-meta-${key}`}
                                                        className="h-10"
                                                        value={data.meta_data_values[key] || ''}
                                                        onChange={(e) => handleMetaDataChange(key, e.target.value)}
                                                        placeholder={`Enter ${key}`}
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
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-document-form"
                        variant="secondary"
                        onClick={() => { isDraftRef.current = true; }}
                        disabled={processing}
                    >
                        {processing && isDraftRef.current ? 'Saving...' : 'Save as Draft'}
                    </Button>
                    <Button
                        type="submit"
                        form="edit-document-form"
                        onClick={() => { isDraftRef.current = false; }}
                        disabled={processing}
                        className="min-w-[140px]"
                    >
                        {processing && !isDraftRef.current ? 'Generating...' : 'Generate Document'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
