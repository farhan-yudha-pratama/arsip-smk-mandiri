import { Head, useForm } from '@inertiajs/react';
import {
    Download,
    FileText,
    Plus,
    Search,
    Trash2,
    History,
    User,
    UserCircle,
    Globe,
    Loader2,
    Pencil,
    CheckCircle,
    Upload,
    MailOpen,
    Filter,
    Users,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import documentRoutes from '@/routes/documents';
import { CreateDocumentModal } from './DocumentModal';
import { EditDocumentModal } from './EditDocumentModal';
import { DocumentHistoryModal } from './DocumentHistoryModal';
import { IncomingMailModal } from './IncomingMailModal';
import { UploadSignedModal } from './UploadSignedModal';
import { Document } from '@/types/document';
import { Template } from '@/types/template';
import { Student, Teacher } from '@/types/user';
import { CategoryNumbering } from '@/types/category-numbering';
import { formatDateTime } from '@/lib/utils';

interface Props {
    documents: Document[];
    templates: Template[];
    students: Student[];
    teachers: Teacher[];
    categoryNumberings: CategoryNumbering[];
}

const RecipientBatchInfo = ({ doc }: { doc: Document }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const recipients = doc.recipient_type === 'STUDENT' ? doc.students : doc.teachers;

    if (!recipients || recipients.length === 0) {
        return (
            <span className="text-xs text-muted-foreground mt-1">
                No Recipients
            </span>
        );
    }

    if (!doc.is_batch) {
        return (
            <span className="text-xs text-muted-foreground mt-1">
                {recipients[0]?.name || 'N/A'}
            </span>
        );
    }

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors mt-1 font-medium"
            >
                <Users className="h-3 w-3 mr-1" />
                {recipients.length} recipients
                {isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </button>
            {isExpanded && (
                <div className="mt-1.5 flex flex-col gap-1 pl-3 border-l-2 border-blue-200">
                    {recipients.map((r, i) => (
                        <span key={i} className="text-[11px] text-muted-foreground leading-tight">
                            {r.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Documents({ documents = [], templates, students, teachers, categoryNumberings = [] }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [recipientFilter, setRecipientFilter] = useState<string>('ALL');
    const [batchFilter, setBatchFilter] = useState<string>('ALL');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [documentForHistory, setDocumentForHistory] = useState<Document | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
    const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
    const [isUploadSignedOpen, setIsUploadSignedOpen] = useState(false);
    const [documentForUpload, setDocumentForUpload] = useState<Document | null>(null);

    const { delete: destroy, processing: deleting } = useForm();
    const { post: postArchive, processing: archiving } = useForm();

    const openDeleteModal = (doc: Document) => {
        setDocumentToDelete(doc);
        setIsDeleteModalOpen(true);
    };

    const openHistoryModal = (doc: Document) => {
        setDocumentForHistory(doc);
        setIsHistoryModalOpen(true);
    };

    const openEditModal = (doc: Document) => {
        setDocumentToEdit(doc);
        setIsEditModalOpen(true);
    };

    const openUploadSignedModal = (doc: Document) => {
        setDocumentForUpload(doc);
        setIsUploadSignedOpen(true);
    };

    const handleArchive = (doc: Document) => {
        postArchive(`/documents/${doc.id}/archive`, {
            onSuccess: () => toast.success('Document archived successfully'),
            onError: () => toast.error('Failed to archive document'),
        });
    };

    const handleDelete = () => {
        if (!documentToDelete) return;

        destroy(documentRoutes.destroy.url(documentToDelete.id.toString()), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDocumentToDelete(null);
                toast.success('Document deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete document');
            },
        });
    };

    const filteredDocuments = useMemo(() => {
        return documents.filter((doc) => {
            const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
            const matchesRecipient = recipientFilter === 'ALL' || doc.recipient_type === recipientFilter;
            const matchesBatch = batchFilter === 'ALL' ||
                                (batchFilter === 'BATCH' && doc.is_batch) ||
                                (batchFilter === 'SINGLE' && !doc.is_batch);
            return matchesSearch && matchesStatus && matchesRecipient && matchesBatch;
        });
    }, [documents, searchTerm, statusFilter, recipientFilter, batchFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="outline">{status}</Badge>;
            case 'PROCESSING': return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {status}
                </Badge>
            );
            case 'GENERATED': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">{status}</Badge>;
            case 'SIGNED': return <Badge className="bg-green-500 text-white hover:bg-green-600 border-green-600">{status}</Badge>;
            case 'ARCHIVED': return <Badge variant="outline" className="bg-gray-100 text-gray-700">{status}</Badge>;
            case 'EXTERNAL': return <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">{status}</Badge>;
            case 'FAILED': return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">{status}</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getRecipientIcon = (type: string) => {
        switch (type) {
            case 'STUDENT': return <User className="h-3 w-3 mr-1" />;
            case 'TEACHER': return <UserCircle className="h-3 w-3 mr-1" />;
            case 'EXTERNAL': return <Globe className="h-3 w-3 mr-1" />;
            default: return null;
        }
    };


    const breadcrumbs = [
        { title: 'Documents', href: '/documents' },
    ];

    return (
        <>
            <Head title="Documents Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
                        <p className="text-muted-foreground">
                            Generate and manage your documents from templates.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setIsIncomingModalOpen(true)} className="w-full sm:w-auto">
                            <MailOpen className="mr-2 h-4 w-4" /> Register Incoming Mail
                        </Button>
                        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Generate Document
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search documents by title..."
                            className="flex-1 bg-transparent text-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-md border border-dashed">
                            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Filters:</span>
                        </div>
                        <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                            <SelectTrigger className="w-[140px] h-9 text-xs">
                                <SelectValue placeholder="Recipient Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Recipients</SelectItem>
                                <SelectItem value="STUDENT">Students</SelectItem>
                                <SelectItem value="TEACHER">Teachers</SelectItem>
                                <SelectItem value="EXTERNAL">External</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={batchFilter} onValueChange={setBatchFilter}>
                            <SelectTrigger className="w-[140px] h-9 text-xs">
                                <SelectValue placeholder="Document Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Types</SelectItem>
                                <SelectItem value="SINGLE">Single Document</SelectItem>
                                <SelectItem value="BATCH">Batch Document</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px] h-9 text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="GENERATED">Generated</SelectItem>
                                <SelectItem value="SIGNED">Signed</SelectItem>
                                <SelectItem value="ARCHIVED">Archived</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchTerm || recipientFilter !== 'ALL' || statusFilter !== 'ALL') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm('');
                                    setRecipientFilter('ALL');
                                    setStatusFilter('ALL');
                                    setBatchFilter('ALL');
                                }}
                                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        {/* Mobile View (Cards) */}
                        <div className="block md:hidden p-4 bg-muted/20">
                            {filteredDocuments.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {filteredDocuments.map((doc) => (
                                        <div key={doc.id} className="flex flex-col gap-3 p-4 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-start gap-2">
                                                    <div className="bg-blue-100 p-2 rounded-lg shrink-0 dark:bg-blue-900/30">
                                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm line-clamp-2 mt-0.5">{doc.title}</span>
                                                        <span className="text-[10px] text-muted-foreground mt-0.5">Template: {doc.template?.name || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 flex flex-col items-end gap-1">
                                                    {getStatusBadge(doc.status)}
                                                    {doc.is_batch && (
                                                        <Badge variant="secondary" className="px-1 h-4 text-[9px] uppercase bg-blue-50 text-blue-600 border-blue-100">Batch</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3 text-xs bg-muted/40 p-3 rounded-lg mt-1">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                                        <User className="h-3 w-3" /> Pembuat
                                                    </span>
                                                    <span className="font-medium">{doc.creator?.name || 'System'}</span>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                                        <Globe className="h-3 w-3" /> Tujuan
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center font-medium">
                                                            {getRecipientIcon(doc.recipient_type)}
                                                            {doc.recipient_type}
                                                        </div>
                                                        <RecipientBatchInfo doc={doc} />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-1">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-md">
                                                    <History className="h-3.5 w-3.5" />
                                                    <span>{formatDateTime(doc.created_at)}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    {doc.status === 'GENERATED' || doc.status === 'SIGNED' || doc.status === 'ARCHIVED' ? (
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                            <a href={documentRoutes.download.url(doc.id.toString())}>
                                                                <Download className="h-3 w-3" />
                                                            </a>
                                                        </Button>
                                                    ) : null}
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openHistoryModal(doc)}>
                                                        <History className="h-3 w-3 text-muted-foreground" />
                                                    </Button>
                                                    {doc.status === 'GENERATED' && (
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600" onClick={() => openUploadSignedModal(doc)}>
                                                            <Upload className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    {doc.status === 'SIGNED' && (
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" onClick={() => handleArchive(doc)} disabled={archiving}>
                                                            <CheckCircle className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => openDeleteModal(doc)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                    {(doc.status === 'DRAFT' || doc.status === 'FAILED') && (
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600" onClick={() => openEditModal(doc)}>
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground bg-card rounded-xl border border-dashed">
                                    No documents found.
                                </div>
                            )}
                        </div>

                        {/* Desktop View (Table) */}
                        <table className="hidden md:table w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Recipient</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Generated At</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.length > 0 ? (
                                    filteredDocuments.map((doc) => (
                                        <tr key={doc.id} className="border-b transition-colors hover:bg-muted/30">
                                            <td className="p-4 align-middle font-medium">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-500" />
                                                        {doc.title}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground mt-1 ml-6">
                                                        Template: {doc.template?.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 text-xs font-medium">
                                                        <div className="flex items-center">
                                                            {getRecipientIcon(doc.recipient_type)}
                                                            {doc.recipient_type}
                                                        </div>
                                                        {doc.is_batch && (
                                                            <Badge variant="secondary" className="px-1 h-4 text-[9px] uppercase bg-blue-50 text-blue-600 border-blue-100">
                                                                Batch
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    <RecipientBatchInfo doc={doc} />
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getStatusBadge(doc.status)}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                <div className="flex flex-col">
                                                    <span>{formatDateTime(doc.created_at)}</span>
                                                    <span className="text-[10px]">{doc.creator?.name || 'System'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right align-middle">
                                                <div className="flex justify-end gap-2">
                                                    {doc.status === 'GENERATED' || doc.status === 'SIGNED' || doc.status === 'ARCHIVED' ? (
                                                        <Button variant="ghost" size="icon" asChild title="Download">
                                                            <a href={documentRoutes.download.url(doc.id.toString())}>
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    ) : (
                                                        <Button variant="ghost" size="icon" disabled title={doc.status === 'PROCESSING' ? "Processing..." : "Download unavailable"}>
                                                            <Download className="h-4 w-4 text-muted-foreground/30" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openHistoryModal(doc)}
                                                        title="History"
                                                    >
                                                        <History className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                    {doc.status === 'GENERATED' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openUploadSignedModal(doc)}
                                                            title="Upload Signed Document"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {doc.status === 'SIGNED' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleArchive(doc)}
                                                            title="Finish & Archive"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            disabled={archiving}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => openDeleteModal(doc)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    {(doc.status === 'DRAFT' || doc.status === 'FAILED') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditModal(doc)}
                                                            title="Edit & Generate"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center align-middle text-muted-foreground">
                                            No documents found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <CreateDocumentModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                templates={templates}
                students={students}
                teachers={teachers}
                categoryNumberings={categoryNumberings}
            />

            <DocumentHistoryModal
                open={isHistoryModalOpen}
                onOpenChange={setIsHistoryModalOpen}
                document={documentForHistory}
            />

            <EditDocumentModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                document={documentToEdit}
                templates={templates}
                students={students}
                teachers={teachers}
                categoryNumberings={categoryNumberings}
            />

            <IncomingMailModal
                open={isIncomingModalOpen}
                onOpenChange={setIsIncomingModalOpen}
            />

            <UploadSignedModal
                open={isUploadSignedOpen}
                onOpenChange={setIsUploadSignedOpen}
                document={documentForUpload}
            />

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the document
                            <span className="font-semibold text-foreground"> {documentToDelete?.title} </span>
                            and all its history from storage.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete Document'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
