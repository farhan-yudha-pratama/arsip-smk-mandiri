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
import { X, Plus, Trash2, FileText, Users, Table as TableIcon, CheckCircle2, ChevronRight, ChevronLeft, Info, Settings } from 'lucide-react';
import { cn, formatIndonesianDate, formatIndonesianDateTime, formatIndonesianTime, parseIndonesianDate, parseIndonesianDateTime } from '@/lib/utils';
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
    syncMode?: boolean;
}

export function CreateDocumentModal({ open, onOpenChange, templates, students, teachers, categoryNumberings = [], syncMode = false }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        template_id: '',
        title: '',
        recipient_type: 'STUDENT',
        student_id: '',
        teacher_id: '',
        student_ids: [] as string[],
        teacher_ids: [] as string[],
        meta_data_values: {} as Record<string, any>,
        category_numbering_id: '' as string | number,
        is_draft: false,
        is_batch: false,
        recipient_name: '',
    });

    const isDraftRef = useRef(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [dynamicRows, setDynamicRows] = useState<any[]>([]);

    useEffect(() => {
        if (data.template_id) {
            const template = templates.find((t) => t.id === data.template_id);
            setSelectedTemplate(template || null);

            if (template) {
                const initialValues: Record<string, any> = {};
                const metaData = Array.isArray(template.meta_data) ? template.meta_data : [];

                metaData.forEach((key: string) => {
                    if (!key.startsWith('T_')) {
                        initialValues[key] = '';
                    }
                });

                const tableKeys = metaData.filter((key: string) => key.startsWith('T_'));
                if (tableKeys.length > 0) {
                    const firstRow: Record<string, any> = { T_no: 1 };
                    tableKeys.forEach(key => {
                        if (key !== 'T_no') firstRow[key] = '';
                    });
                    setDynamicRows([firstRow]);
                    initialValues['T_table_data'] = [firstRow];
                } else {
                    setDynamicRows([]);
                }

                setData(prev => ({
                    ...prev,
                    meta_data_values: initialValues
                }));
            }
        }
    }, [data.template_id, templates]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleMetaDataChange = (key: string, value: string) => {
        setData(prev => ({
            ...prev,
            meta_data_values: {
                ...prev.meta_data_values,
                [key]: value,
            }
        }));
    };

    const addRow = () => {
        const templateKeys = (selectedTemplate?.meta_data || []).filter((k: string) => k.startsWith('T_'));
        const newRow: Record<string, any> = { T_no: dynamicRows.length + 1 };
        templateKeys.forEach(key => {
            if (key !== 'T_no') newRow[key] = '';
        });

        const updatedRows = [...dynamicRows, newRow];
        setDynamicRows(updatedRows);
        setData(prev => ({
            ...prev,
            meta_data_values: {
                ...prev.meta_data_values,
                T_table_data: updatedRows
            }
        }));
    };

    const removeRow = (index: number) => {
        const updatedRows = dynamicRows.filter((_, i) => i !== index).map((row, i) => ({
            ...row,
            T_no: i + 1
        }));
        setDynamicRows(updatedRows);
        setData(prev => ({
            ...prev,
            meta_data_values: {
                ...prev.meta_data_values,
                T_table_data: updatedRows
            }
        }));
    };

    const handleRowChange = (index: number, key: string, value: any) => {
        const updatedRows = [...dynamicRows];
        updatedRows[index] = { ...updatedRows[index], [key]: value };
        setDynamicRows(updatedRows);
        setData(prev => ({
            ...prev,
            meta_data_values: {
                ...prev.meta_data_values,
                T_table_data: updatedRows
            }
        }));
    };

    const handleUserSelectInRow = (index: number, userId: string, type: 'STUDENT' | 'TEACHER') => {
        const updatedRows = [...dynamicRows];
        if (type === 'STUDENT') {
            const student = students.find(s => s.id.toString() === userId);
            if (student) {
                const currentRow = { ...updatedRows[index], student_id: student.id.toString() };
                Object.keys(currentRow).forEach(key => {
                    if (key.includes('nama-siswa') || key.includes('nama-murid')) currentRow[key] = student.name;
                    if (key.includes('nis')) currentRow[key] = (student as any).nis || (student as any).nisn || '';
                    if (key.includes('kelas')) currentRow[key] = (student as any).kelas || '';
                    if (key.includes('jurusan')) currentRow[key] = (student as any).jurusan || (student as any).major || '';
                });
                updatedRows[index] = currentRow;
            }
        } else {
            const teacher = teachers.find(t => t.id.toString() === userId);
            if (teacher) {
                const currentRow = { ...updatedRows[index], teacher_id: teacher.id.toString() };
                Object.keys(currentRow).forEach(key => {
                    if (key.includes('nama-guru')) currentRow[key] = teacher.name;
                    if (key.includes('nip')) currentRow[key] = (teacher as any).nip || '';
                });
                updatedRows[index] = currentRow;
            }
        }
        setDynamicRows(updatedRows);
        setData(prev => ({
            ...prev,
            meta_data_values: {
                ...prev.meta_data_values,
                T_table_data: updatedRows
            }
        }));
    };

    const copyRecipientsFromTable = () => {
        const tableKeys = (selectedTemplate?.meta_data || []).filter((key: string) => key.startsWith('T_'));
        const hasStudent = tableKeys.some(k => k.includes('nama-siswa') || k.includes('nama-murid'));
        const hasTeacher = tableKeys.some(k => k.includes('nama-guru'));

        if (hasStudent) {
            const sIds = dynamicRows.map(r => r.student_id).filter(Boolean);
            const uniqueIds = Array.from(new Set(sIds)) as string[];
            setData(prev => ({ ...prev, recipient_type: 'STUDENT', is_batch: true, student_ids: uniqueIds }));
            toast.success(`${uniqueIds.length} siswa berhasil disalin dari tabel.`);
        } else if (hasTeacher) {
            const tIds = dynamicRows.map(r => r.teacher_id).filter(Boolean);
            const uniqueIds = Array.from(new Set(tIds)) as string[];
            setData(prev => ({ ...prev, recipient_type: 'TEACHER', is_batch: true, teacher_ids: uniqueIds }));
            toast.success(`${uniqueIds.length} guru berhasil disalin dari tabel.`);
        } else {
            toast.error("Tidak ditemukan kolom nama-siswa atau nama-guru di tabel.");
        }
    };

    const handleSubmit = (e?: FormEvent) => {
        if (e) e.preventDefault();
        const isDraft = isDraftRef.current;

        transform((currentData) => ({
            ...currentData,
            is_draft: isDraft,
        }));

        post(documentRoutes.store.url(), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                setCurrentStep(1);
                toast.success(isDraft ? 'Dokumen disimpan sebagai draf' : (syncMode ? 'Dokumen berhasil dibuat' : 'Pembuatan dokumen dimulai di latar belakang'));
            },
        });

        if (!isDraft) {
            toast.info(syncMode ? 'Sedang memproses dokumen, mohon tunggu...' : 'Dokumen sedang diproses di latar belakang...');
        }
    };

    const scalarKeys = (selectedTemplate?.meta_data || []).filter((key: string) => !key.startsWith('T_'));
    const tableKeys = (selectedTemplate?.meta_data || []).filter((key: string) => key.startsWith('T_'));
    const hasTable = tableKeys.length > 0;

    if (!open) return null;

    const steps = [
        { id: 1, title: 'Konfigurasi Dasar', icon: Settings },
        { id: 2, title: 'Isi Data Dokumen', icon: FileText },
        { id: 3, title: 'Penerima Dokumen', icon: Users },
    ];

    const canGoToStep2 = data.template_id && data.title;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="bg-background w-full max-w-6xl h-full sm:h-[85vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-border/50 animate-in zoom-in-95 duration-300"
            >
                {/* Header Section */}
                <div className="px-8 py-5 border-b bg-card flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2.5 rounded-2xl">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Buat Dokumen Baru</h2>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-0.5 opacity-70">
                                Generation Workspace
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Steps */}
                    <div className="w-72 border-r bg-muted/20 flex flex-col shrink-0 hidden md:flex">
                        <div className="p-6 space-y-2 flex-1">
                            {steps.map((s) => {
                                const Icon = s.icon;
                                const isActive = currentStep === s.id;
                                const isCompleted = currentStep > s.id;

                                return (
                                    <div
                                        key={s.id}
                                        className={cn(
                                            "relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                                            isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" : "text-muted-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                                            isActive ? "bg-white/20" : "bg-muted-foreground/10"
                                        )}>
                                            {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Tahap {s.id}</span>
                                            <span className="text-sm font-bold leading-none">{s.title}</span>
                                        </div>
                                        {isActive && <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full" />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Live Summary Panel */}
                        <div className="p-6 border-t bg-muted/40 m-4 rounded-2xl border border-border/50">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                <Info className="h-3 w-3" /> Ringkasan Pilihan
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">Template</p>
                                    <p className="text-xs font-bold truncate">{selectedTemplate?.name || 'Belum dipilih'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">Judul</p>
                                    <p className="text-xs font-bold truncate">{data.title || 'Belum diisi'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">Penerima</p>
                                    <p className="text-xs font-bold truncate">
                                        {data.recipient_type === 'STUDENT' ? 'Siswa' : 'Guru'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 bg-background/50">
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth pb-10">
                            {currentStep === 1 ? (
                                <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold flex items-center gap-3">
                                                <div className="h-8 w-1.5 bg-primary rounded-full" />
                                                Informasi Dasar
                                            </h3>
                                            <div className="grid gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-bold text-muted-foreground ml-1">Template Dokumen</Label>
                                                    <Select
                                                        value={data.template_id}
                                                        onValueChange={(value) => setData('template_id', value)}
                                                    >
                                                        <SelectTrigger className="h-14 rounded-2xl border-2 bg-muted/10 focus:ring-primary/20 transition-all hover:bg-muted/20">
                                                            <SelectValue placeholder="Pilih template yang akan digunakan" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl shadow-xl">
                                                            {templates.map((t) => (
                                                                <SelectItem key={t.id.toString()} value={t.id.toString()} className="rounded-xl my-1">
                                                                    {t.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-bold text-muted-foreground ml-1">Judul Dokumen</Label>
                                                    <Input
                                                        className="h-14 rounded-2xl border-2 bg-muted/10 focus:ring-primary/20 transition-all hover:bg-muted/20"
                                                        value={data.title}
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        placeholder="Contoh: Surat Keterangan Lulus TA 2023/2024"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : currentStep === 2 ? (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                    {selectedTemplate && (
                                        <div className="space-y-10">
                                            {/* Scalar Metadata */}
                                            {scalarKeys.length > 0 && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between px-2">
                                                        <h3 className="text-lg font-extrabold flex items-center gap-3">
                                                            <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                                            Detail Variabel Dokumen
                                                        </h3>
                                                    </div>
                                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                        {scalarKeys.map((key: string) => {
                                                            const cleanKey = key.replace(/[{}]/g, '');
                                                            const isStudentKey = /^(nama-siswa|nama-murid)(\d*)$/.test(cleanKey);
                                                            const isTeacherKey = /^nama-guru(\d*)$/.test(cleanKey);
                                                            const currentVal = data.meta_data_values[key] || '';

                                                            return (
                                                                <div key={key} className="group relative p-6 rounded-3xl border-2 border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-xl">
                                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-3 block">
                                                                        {key.replace(/_/g, ' ')}
                                                                    </Label>
                                                                    {isStudentKey ? (
                                                                        <SearchableSelect
                                                                            options={students.map(s => ({ label: `${s.name} (${s.nis})`, value: s.id.toString() }))}
                                                                            value={students.find(s => s.name === currentVal)?.id.toString() || ''}
                                                                            onChange={(id) => {
                                                                                const student = students.find(s => s.id.toString() === id);
                                                                                if (student) handleMetaDataChange(key, student.name);
                                                                            }}
                                                                            placeholder="Pilih Siswa"
                                                                        />
                                                                    ) : isTeacherKey ? (
                                                                        <SearchableSelect
                                                                            options={teachers.map(t => ({ label: `${t.name} (${t.nip})`, value: t.id.toString() }))}
                                                                            value={teachers.find(t => t.name === currentVal)?.id.toString() || ''}
                                                                            onChange={(id) => {
                                                                                const teacher = teachers.find(t => t.id.toString() === id);
                                                                                if (teacher) handleMetaDataChange(key, teacher.name);
                                                                            }}
                                                                            placeholder="Pilih Guru"
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
                                                                                            [key]: "[AUTO]"
                                                                                        }
                                                                                    }));
                                                                                }
                                                                            }}
                                                                            placeholder="Pilih Kategori"
                                                                        />
                                                                    ) : key.includes('T_jadwal_start_end_waktu') ? (
                                                                        <div className="flex flex-col gap-2">
                                                                            <Input
                                                                                type="datetime-local"
                                                                                className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                value={parseIndonesianDateTime((data.meta_data_values[key] || '').split(' s/d ')[0])}
                                                                                onChange={(e) => {
                                                                                    const end = (data.meta_data_values[key] || '').split(' s/d ')[1] || '';
                                                                                    handleMetaDataChange(key, `${formatIndonesianDateTime(e.target.value)}${end ? ` s/d ${end}` : ''}`);
                                                                                }}
                                                                            />
                                                                            <div className="text-[10px] text-center text-muted-foreground font-bold">s/d</div>
                                                                            <Input
                                                                                type="datetime-local"
                                                                                className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
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
                                                                                className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                value={parseIndonesianDate((data.meta_data_values[key] || '').split(' s/d ')[0])}
                                                                                onChange={(e) => {
                                                                                    const end = (data.meta_data_values[key] || '').split(' s/d ')[1] || '';
                                                                                    handleMetaDataChange(key, `${formatIndonesianDate(e.target.value)}${end ? ` s/d ${end}` : ''}`);
                                                                                }}
                                                                            />
                                                                            <div className="text-[10px] text-center text-muted-foreground font-bold">s/d</div>
                                                                            <Input
                                                                                type="date"
                                                                                className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
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
                                                                                className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                value={parseIndonesianDateTime(data.meta_data_values[key] || '')}
                                                                                onChange={(e) => handleMetaDataChange(key, formatIndonesianDateTime(e.target.value))}
                                                                            />
                                                                            <p className="text-[10px] font-medium text-primary truncate">{data.meta_data_values[key]}</p>
                                                                        </div>
                                                                    ) : key.includes('T_jadwal_date') || key.includes('tanggal') ? (
                                                                        <div className="space-y-1">
                                                                            <Input
                                                                                type="date"
                                                                                className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                value={parseIndonesianDate(data.meta_data_values[key] || '')}
                                                                                onChange={(e) => handleMetaDataChange(key, formatIndonesianDate(e.target.value))}
                                                                            />
                                                                            <p className="text-[10px] font-medium text-primary truncate">{data.meta_data_values[key]}</p>
                                                                        </div>
                                                                    ) : key.includes('waktu') ? (
                                                                        <div className="space-y-1">
                                                                            <Input
                                                                                type="time"
                                                                                className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                value={data.meta_data_values[key] || ''}
                                                                                onChange={(e) => handleMetaDataChange(key, formatIndonesianTime(`2000-01-01T${e.target.value}`))}
                                                                            />
                                                                            <p className="text-[10px] font-medium text-primary truncate">{data.meta_data_values[key]}</p>
                                                                        </div>
                                                                    ) : (

                                                                        <Input
                                                                            className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                            value={data.meta_data_values[key] || ''}
                                                                            onChange={(e) => handleMetaDataChange(key, e.target.value)}
                                                                            placeholder="Input nilai..."
                                                                        />
                                                                    )}

                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Dynamic Row List Builder */}
                                            {hasTable && (
                                                <div className="space-y-6 pt-4">
                                                    <div className="flex items-center justify-between px-2">
                                                        <h3 className="text-lg font-extrabold flex items-center gap-3">
                                                            <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                                            Daftar Penerima Berjamaah
                                                        </h3>
                                                        <Button type="button" size="sm" onClick={addRow} className="gap-2 rounded-xl px-5 h-10 shadow-lg shadow-primary/20">
                                                            <Plus className="h-4 w-4" /> Tambah Baris
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {dynamicRows.map((row, index) => (
                                                            <div key={index} className="group relative bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-[2rem] overflow-hidden shadow-lg transition-all hover:border-primary/30">
                                                                <div className="px-6 py-3 bg-muted/30 border-b flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">
                                                                            {index + 1}
                                                                        </div>
                                                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Penerima</span>
                                                                    </div>
                                                                    {dynamicRows.length > 1 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeRow(index)}
                                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-xl"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                                    {tableKeys.map(key => {
                                                                        if (key === 'T_no') return null;
                                                                        const isStudentNameKey = key.includes('nama-siswa') || key.includes('nama-murid');
                                                                        const isTeacherNameKey = key.includes('nama-guru');
                                                                        return (
                                                                            <div key={key} className="space-y-1.5">
                                                                                <Label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60 ml-1">
                                                                                    {key.replace('T_', '').replace(/-/g, ' ')}
                                                                                </Label>
                                                                                {isStudentNameKey ? (
                                                                                    <SearchableSelect
                                                                                        options={students.map(s => ({ label: s.name, value: s.id.toString() }))}
                                                                                        value={row.student_id?.toString() || ''}
                                                                                        onChange={(val) => handleUserSelectInRow(index, val, 'STUDENT')}
                                                                                        placeholder="Cari Siswa..."
                                                                                        className="h-11"
                                                                                    />
                                                                                ) : isTeacherNameKey ? (
                                                                                    <SearchableSelect
                                                                                        options={teachers.map(t => ({ label: t.name, value: t.id.toString() }))}
                                                                                        value={row.teacher_id?.toString() || ''}
                                                                                        onChange={(val) => handleUserSelectInRow(index, val, 'TEACHER')}
                                                                                        placeholder="Cari Guru..."
                                                                                        className="h-11"
                                                                                    />
                                                                                ) : key.includes('T_jadwal_start_end_waktu') ? (
                                                                                    <div className="flex flex-col gap-2">
                                                                                        <Input
                                                                                            type="datetime-local"
                                                                                            className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                            value={parseIndonesianDateTime((row[key] || '').split(' s/d ')[0])}
                                                                                            onChange={(e) => {
                                                                                                const end = (row[key] || '').split(' s/d ')[1] || '';
                                                                                                handleRowChange(index, key, `${formatIndonesianDateTime(e.target.value)}${end ? ` s/d ${end}` : ''}`);
                                                                                            }}
                                                                                        />
                                                                                        <div className="text-[10px] text-center text-muted-foreground font-bold">s/d</div>
                                                                                        <Input
                                                                                            type="datetime-local"
                                                                                            className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                            value={parseIndonesianDateTime((row[key] || '').split(' s/d ')[1])}
                                                                                            onChange={(e) => {
                                                                                                const start = (row[key] || '').split(' s/d ')[0] || '';
                                                                                                handleRowChange(index, key, `${start}${start ? ` s/d ` : ''}${formatIndonesianDateTime(e.target.value)}`);
                                                                                            }}
                                                                                        />
                                                                                        <p className="text-[10px] font-medium text-primary mt-1 truncate">{row[key]}</p>
                                                                                    </div>
                                                                                ) : key.includes('T_jadwal_start_end_date') ? (
                                                                                    <div className="flex flex-col gap-2">
                                                                                        <Input
                                                                                            type="date"
                                                                                            className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                            value={parseIndonesianDate((row[key] || '').split(' s/d ')[0])}
                                                                                            onChange={(e) => {
                                                                                                const end = (row[key] || '').split(' s/d ')[1] || '';
                                                                                                handleRowChange(index, key, `${formatIndonesianDate(e.target.value)}${end ? ` s/d ${end}` : ''}`);
                                                                                            }}
                                                                                        />
                                                                                        <div className="text-[10px] text-center text-muted-foreground font-bold">s/d</div>
                                                                                        <Input
                                                                                            type="date"
                                                                                            className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                            value={parseIndonesianDate((row[key] || '').split(' s/d ')[1])}
                                                                                            onChange={(e) => {
                                                                                                const start = (row[key] || '').split(' s/d ')[0] || '';
                                                                                                handleRowChange(index, key, `${start}${start ? ` s/d ` : ''}${formatIndonesianDate(e.target.value)}`);
                                                                                            }}
                                                                                        />
                                                                                        <p className="text-[10px] font-medium text-primary mt-1 truncate">{row[key]}</p>
                                                                                    </div>
                                                                                ) : key.includes('T_jadwal_waktu') ? (
                                                                                    <div className="space-y-1">
                                                                                        <Input
                                                                                            type="datetime-local"
                                                                                            className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                            value={parseIndonesianDateTime(row[key] || '')}
                                                                                            onChange={(e) => handleRowChange(index, key, formatIndonesianDateTime(e.target.value))}
                                                                                        />
                                                                                        <p className="text-[10px] font-medium text-primary truncate">{row[key]}</p>
                                                                                    </div>
                                                                                ) : key.includes('T_jadwal_date') || key.includes('tanggal') ? (
                                                                                    <div className="space-y-1">
                                                                                        <Input
                                                                                            type="date"
                                                                                            className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                            value={parseIndonesianDate(row[key] || '')}
                                                                                            onChange={(e) => handleRowChange(index, key, formatIndonesianDate(e.target.value))}
                                                                                        />
                                                                                        <p className="text-[10px] font-medium text-primary truncate">{row[key]}</p>
                                                                                    </div>
                                                                                ) : key.includes('waktu') ? (
                                                                                    <div className="space-y-1">
                                                                                        <Input
                                                                                            type="time"
                                                                                            className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                            value={row[key] || ''}
                                                                                            onChange={(e) => handleRowChange(index, key, formatIndonesianTime(`2000-01-01T${e.target.value}`))}
                                                                                        />
                                                                                        <p className="text-[10px] font-medium text-primary truncate">{row[key]}</p>
                                                                                    </div>
                                                                                ) : (

                                                                                    <Input
                                                                                        value={row[key]}
                                                                                        onChange={(e) => handleRowChange(index, key, e.target.value)}
                                                                                        className="h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all"
                                                                                        placeholder={`Isi ${key.replace('T_', '')}`}
                                                                                    />
                                                                                )}

                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-start gap-2 text-[10px] text-muted-foreground italic px-4 bg-muted/20 p-4 rounded-2xl border border-dashed">
                                                        <Info className="h-3 w-3 shrink-0 mt-0.5" />
                                                        <span>Data akan otomatis diurutkan berdasarkan Kelas dan Jurusan untuk hasil PDF yang rapi.</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : currentStep === 3 ? (
                                <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold flex items-center gap-3">
                                                <div className="h-8 w-1.5 bg-primary rounded-full" />
                                                Penerima Dokumen
                                            </h3>

                                            <div className="grid gap-6 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-bold text-muted-foreground ml-1">Mode Dokumen</Label>
                                                    <Select
                                                        value={data.is_batch ? 'BATCH' : 'SINGLE'}
                                                        onValueChange={(val) => setData('is_batch', val === 'BATCH')}
                                                    >
                                                        <SelectTrigger className="h-14 rounded-2xl border-2 bg-muted/10 focus:ring-primary/20 transition-all hover:bg-muted/20">
                                                            <SelectValue placeholder="Pilih mode" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl shadow-xl">
                                                            <SelectItem value="SINGLE" className="rounded-xl">Satu Tujuan (Single)</SelectItem>
                                                            <SelectItem value="BATCH" className="rounded-xl">Banyak Tujuan (Batch)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-bold text-muted-foreground ml-1">Tipe Penerima</Label>
                                                    <Select
                                                        value={data.recipient_type}
                                                        onValueChange={(value) => {
                                                            setData('recipient_type', value);
                                                            if (value === 'EXTERNAL' && !data.recipient_name) {
                                                                setData('recipient_name', 'External');
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-14 rounded-2xl border-2 bg-muted/10 focus:ring-primary/20 transition-all hover:bg-muted/20">
                                                            <SelectValue placeholder="Pilih tipe" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl shadow-xl">
                                                            <SelectItem value="STUDENT" className="rounded-xl">Siswa</SelectItem>
                                                            <SelectItem value="TEACHER" className="rounded-xl">Guru</SelectItem>
                                                            <SelectItem value="EXTERNAL" className="rounded-xl">External</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {!data.is_batch ? (
                                                <div className="space-y-2 mt-4">
                                                    <Label className="text-sm font-bold text-muted-foreground ml-1">
                                                        {data.recipient_type === 'STUDENT' ? 'Nama Siswa' : data.recipient_type === 'TEACHER' ? 'Nama Guru' : 'Nama Penerima External'}
                                                    </Label>
                                                    {data.recipient_type === 'STUDENT' ? (
                                                        <SearchableSelect
                                                            options={students.map(s => ({ label: `${s.name} (${s.nis})`, value: s.id.toString() }))}
                                                            value={data.student_id?.toString() || ''}
                                                            onChange={(value) => setData('student_id', value)}
                                                            placeholder="Cari siswa..."
                                                            className="h-14"
                                                        />
                                                    ) : data.recipient_type === 'TEACHER' ? (
                                                        <SearchableSelect
                                                            options={teachers.map(t => ({ label: `${t.name} (${t.nip})`, value: t.id.toString() }))}
                                                            value={data.teacher_id?.toString() || ''}
                                                            onChange={(value) => setData('teacher_id', value)}
                                                            placeholder="Cari guru..."
                                                            className="h-14"
                                                        />
                                                    ) : (
                                                        <Input
                                                            className="h-14 rounded-2xl border-2 bg-muted/10 focus:ring-primary/20 transition-all hover:bg-muted/20"
                                                            value={data.recipient_name || ''}
                                                            onChange={(e) => setData('recipient_name', e.target.value)}
                                                            placeholder="Nama Penerima External..."
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-4 mt-6 p-6 rounded-3xl border-2 border-border/50 bg-card/40">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label className="text-sm font-bold text-muted-foreground">Daftar Penerima Batch</Label>
                                                        <Button
                                                            type="button"
                                                            onClick={copyRecipientsFromTable}
                                                            className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
                                                            size="sm"
                                                        >
                                                            <Users className="h-4 w-4" /> Salin dari Tabel Tahap 2
                                                        </Button>
                                                    </div>

                                                    <div className="bg-muted/30 rounded-2xl p-4 min-h-[100px] max-h-[300px] overflow-y-auto border border-dashed flex flex-col gap-2">
                                                        {data.recipient_type === 'STUDENT' && data.student_ids.length > 0 ? (
                                                            data.student_ids.map(id => {
                                                                const s = students.find(x => x.id.toString() === id.toString());
                                                                return s ? (
                                                                    <div key={id} className="flex items-center justify-between bg-background p-3 rounded-xl border shadow-sm">
                                                                        <span className="text-sm font-medium">{s.name} ({s.nis})</span>
                                                                        <Button type="button" variant="ghost" size="sm" onClick={() => setData('student_ids', data.student_ids.filter(x => x !== id))} className="h-8 w-8 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></Button>
                                                                    </div>
                                                                ) : null;
                                                            })
                                                        ) : data.recipient_type === 'TEACHER' && data.teacher_ids.length > 0 ? (
                                                            data.teacher_ids.map(id => {
                                                                const t = teachers.find(x => x.id.toString() === id.toString());
                                                                return t ? (
                                                                    <div key={id} className="flex items-center justify-between bg-background p-3 rounded-xl border shadow-sm">
                                                                        <span className="text-sm font-medium">{t.name} ({t.nip})</span>
                                                                        <Button type="button" variant="ghost" size="sm" onClick={() => setData('teacher_ids', data.teacher_ids.filter(x => x !== id))} className="h-8 w-8 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></Button>
                                                                    </div>
                                                                ) : null;
                                                            })
                                                        ) : (
                                                            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground italic">
                                                                Belum ada penerima disalin. Silahkan klik tombol di atas.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Integrated Footer */}
                <div className="px-8 border-t bg-card flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setCurrentStep(1)}
                                className="h-12 rounded-2xl px-6 gap-2 font-bold hover:bg-muted"
                            >
                                <ChevronLeft className="h-4 w-4" /> Kembali
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-12 rounded-2xl px-6 font-bold"
                        >
                            Batal
                        </Button>

                        {currentStep < 3 ? (
                            <Button
                                type="button"
                                disabled={currentStep === 1 && !canGoToStep2}
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="h-12 rounded-2xl px-8 gap-2 font-bold shadow-xl shadow-primary/20"
                            >
                                Selanjutnya <ChevronRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => { isDraftRef.current = true; handleSubmit(); }}
                                    disabled={processing}
                                    className="h-12 rounded-2xl px-6 font-bold border-2"
                                >
                                    {processing && isDraftRef.current ? 'Menyimpan...' : 'Simpan Draf'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => { isDraftRef.current = false; handleSubmit(); }}
                                    disabled={processing}
                                    className="h-12 rounded-2xl px-10 gap-2 font-black shadow-xl shadow-primary/30 min-w-[160px]"
                                >
                                    {processing && !isDraftRef.current ? (syncMode ? 'Sedang Memproses...' : 'Menyimpan...') : 'Generate Dokumen'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
