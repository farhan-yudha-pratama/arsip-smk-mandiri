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
import { X, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import documentRoutes from '@/routes/documents';
import { Template } from '@/types/template';
import { CategoryNumbering } from '@/types/category-numbering';
import { Student, Teacher } from '@/types/user';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templates: Template[];
    students: Student[];
    teachers: Teacher[];
    categoryNumberings: CategoryNumbering[];
}

export function CreateDocumentModal({ open, onOpenChange, templates, students, teachers, categoryNumberings = [] }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        template_id: '',
        title: '',
        recipient_type: 'STUDENT',
        student_id: '',
        teacher_id: '',
        meta_data_values: {} as Record<string, any>,
        category_numbering_id: '' as string | number,
        is_draft: false,
    });

    const isDraftRef = useRef(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [dynamicRows, setDynamicRows] = useState<any[]>([]);

    useEffect(() => {
        if (data.template_id) {
            const template = templates.find((t) => t.id === data.template_id);
            setSelectedTemplate(template || null);

            if (template) {
                const initialValues: Record<string, any> = {};
                const metaData = Array.isArray(template.meta_data) ? template.meta_data : [];

                // Initialize scalar values
                metaData.forEach((key: string) => {
                    if (!key.startsWith('T_')) {
                        initialValues[key] = '';
                    }
                });

                // Check for table variables (prefix T_)
                const tableKeys = metaData.filter((key: string) => key.startsWith('T_'));
                if (tableKeys.length > 0) {
                    // Create dynamic first row based on keys found in template
                    const firstRow: Record<string, any> = { T_no: 1 };
                    tableKeys.forEach(key => {
                        if (key !== 'T_no') firstRow[key] = '';
                    });
                    setDynamicRows([firstRow]);
                    initialValues['T_table_data'] = [firstRow];
                } else {
                    setDynamicRows([]);
                }

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

    const addRow = () => {
        const templateKeys = (selectedTemplate?.meta_data || []).filter((k: string) => k.startsWith('T_'));
        const newRow: Record<string, any> = { T_no: dynamicRows.length + 1 };
        templateKeys.forEach(key => {
            if (key !== 'T_no') newRow[key] = '';
        });

        const updatedRows = [...dynamicRows, newRow];
        setDynamicRows(updatedRows);
        setData('meta_data_values', {
            ...data.meta_data_values,
            T_table_data: updatedRows
        });
    };

    const removeRow = (index: number) => {
        const updatedRows = dynamicRows.filter((_, i) => i !== index).map((row, i) => ({
            ...row,
            T_no: i + 1
        }));
        setDynamicRows(updatedRows);
        setData('meta_data_values', {
            ...data.meta_data_values,
            T_table_data: updatedRows
        });
    };

    const handleRowChange = (index: number, key: string, value: any) => {
        const updatedRows = [...dynamicRows];
        updatedRows[index] = { ...updatedRows[index], [key]: value };
        setDynamicRows(updatedRows);
        setData('meta_data_values', {
            ...data.meta_data_values,
            T_table_data: updatedRows
        });
    };

    const handleStudentSelectInRow = (index: number, studentId: string) => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            const updatedRows = [...dynamicRows];
            const currentRow = { ...updatedRows[index], student_id: student.id };

            // Map student data to any matching T_ keys
            Object.keys(currentRow).forEach(key => {
                if (key.includes('nama')) currentRow[key] = student.name;
                if (key.includes('nis')) currentRow[key] = (student as any).nis || (student as any).nisn || '';
                if (key.includes('kelas')) currentRow[key] = (student as any).kelas || '';
                if (key.includes('jurusan')) currentRow[key] = (student as any).jurusan || (student as any).major || '';
            });

            updatedRows[index] = currentRow;
            setDynamicRows(updatedRows);
            setData('meta_data_values', {
                ...data.meta_data_values,
                T_table_data: updatedRows
            });
        }
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

    const scalarKeys = (selectedTemplate?.meta_data || []).filter((key: string) => !key.startsWith('T_'));
    const tableKeys = (selectedTemplate?.meta_data || []).filter((key: string) => key.startsWith('T_'));
    const hasTable = tableKeys.length > 0;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div
                className="bg-background w-full max-w-5xl h-auto my-auto rounded-2xl shadow-2xl flex flex-col border animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Buat Dokumen</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Lengkapi informasi untuk men-generate dokumen baru.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    <form onSubmit={handleSubmit} id="create-document-form" className="space-y-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Template</Label>
                                <Select
                                    value={data.template_id}
                                    onValueChange={(value) => setData('template_id', value)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Pilih template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map((t) => (
                                            <SelectItem key={t.id.toString()} value={t.id.toString()}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Judul Dokumen</Label>
                                <Input
                                    className="h-11"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="contoh: Surat Keterangan Lulus - John Doe"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Tipe Penerima</Label>
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
                            </div>

                            {data.recipient_type === 'STUDENT' && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Siswa Utama (Penerima)</Label>
                                    <SearchableSelect
                                        options={students.map(s => ({ label: `${s.name} (${s.nis})`, value: s.id }))}
                                        value={data.student_id}
                                        onChange={(value) => setData('student_id', value)}
                                        placeholder="Pilih Siswa"
                                        className="h-11"
                                        inline
                                    />
                                </div>
                            )}

                            {data.recipient_type === 'TEACHER' && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Guru Utama (Penerima)</Label>
                                    <SearchableSelect
                                        options={teachers.map(t => ({ label: `${t.name} (${t.nip})`, value: t.id }))}
                                        value={data.teacher_id}
                                        onChange={(value) => setData('teacher_id', value)}
                                        placeholder="Pilih Guru"
                                        className="h-11"
                                        inline
                                    />
                                </div>
                            )}
                        </div>

                        {selectedTemplate && (
                            <div className="space-y-6">
                                {/* Scalar Variables */}
                                {scalarKeys.length > 0 && (
                                    <div className="space-y-4 rounded-xl border bg-muted/20 p-5">
                                        <h3 className="font-bold text-sm flex items-center gap-2">
                                            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                                            Informasi Dokumen
                                        </h3>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            {scalarKeys.map((key: string) => {
                                                const cleanKey = key.replace(/[{}]/g, '');
                                                const isStudentKey = /^(nama-siswa|nama-murid)(\d*)$/.test(cleanKey);
                                                const isTeacherKey = /^nama-guru(\d*)$/.test(cleanKey);

                                                return (
                                                    <div key={key} className="space-y-2">
                                                        <Label className="capitalize text-xs font-semibold text-muted-foreground">
                                                            {key.replace(/_/g, ' ')}
                                                        </Label>
                                                        {isStudentKey ? (
                                                            <SearchableSelect
                                                                options={students.map(s => ({ label: `${s.name} (${s.nis})`, value: s.name }))}
                                                                value={data.meta_data_values[key] || ''}
                                                                onChange={(value) => handleMetaDataChange(key, value)}
                                                                placeholder="Pilih Siswa"
                                                                inline
                                                            />
                                                        ) : isTeacherKey ? (
                                                            <SearchableSelect
                                                                options={teachers.map(t => ({ label: `${t.name} (${t.nip})`, value: t.name }))}
                                                                value={data.meta_data_values[key] || ''}
                                                                onChange={(value) => handleMetaDataChange(key, value)}
                                                                placeholder="Pilih Guru"
                                                                inline
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
                                                                                [key]: "[AUTO]" // Akan di-generate backend
                                                                            }
                                                                        }));
                                                                    }
                                                                }}
                                                                placeholder="Pilih Kategori Penomoran"
                                                                inline
                                                            />
                                                        ) : (
                                                            <Input
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

                                {/* Dynamic Table Builder */}
                                {hasTable && (
                                    <div className="space-y-4 rounded-xl border bg-primary/5 p-5 border-primary/20">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                                                Dynamic Row Builder (Tabel Siswa)
                                            </h3>
                                            <Button type="button" size="sm" onClick={addRow} className="gap-2 h-8">
                                                <Plus className="h-3.5 w-3.5" /> Tambah Baris
                                            </Button>
                                        </div>

                                        <div className="border rounded-lg bg-background">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                    <thead className="bg-muted border-b">
                                                        <tr>
                                                            {tableKeys.map(key => (
                                                                <th key={key} className={cn(
                                                                    "px-3 py-2 text-left font-bold text-muted-foreground uppercase tracking-wider",
                                                                    key === 'T_no' ? "w-12" : ""
                                                                )}>
                                                                    {key.replace('T_', '').replace(/-/g, ' ')}
                                                                </th>
                                                            ))}
                                                            <th className="px-3 py-2 text-center w-10"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {dynamicRows.map((row, index) => (
                                                            <tr key={index} className="group">
                                                                {tableKeys.map(key => {
                                                                    const isNameKey = key.includes('nama');
                                                                    return (
                                                                        <td key={key} className="px-3 py-2">
                                                                            {isNameKey ? (
                                                                                <SearchableSelect
                                                                                    options={students.map(s => ({ label: s.name, value: s.id }))}
                                                                                    value={row.student_id || ''}
                                                                                    onChange={(val) => handleStudentSelectInRow(index, val)}
                                                                                    placeholder="Cari..."
                                                                                    className="h-8 text-xs min-w-[150px]"
                                                                                    inline
                                                                                />
                                                                            ) : (
                                                                                <Input
                                                                                    value={row[key]}
                                                                                    onChange={(e) => handleRowChange(index, key, e.target.value)}
                                                                                    className={cn(
                                                                                        "h-8 text-xs",
                                                                                        key === 'T_no' ? "text-center p-1" : ""
                                                                                    )}
                                                                                    readOnly={key === 'T_no'}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                                <td className="px-3 py-2 text-center">
                                                                    {dynamicRows.length > 1 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeRow(index)}
                                                                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">
                                            * Data akan otomatis diurutkan berdasarkan Kelas dan Jurusan. Kolom Kelas & Jurusan yang sama akan digabungkan secara visual.
                                        </p>
                                    </div>
                                )}
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


