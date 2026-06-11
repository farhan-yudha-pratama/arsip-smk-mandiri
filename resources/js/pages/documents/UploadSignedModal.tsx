import { useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
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
import { Document } from '@/types/document';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: Document | null;
}

export function UploadSignedModal({ open, onOpenChange, document }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!document) return;

        post(`/documents/${document.id}/signed`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success('Signed document uploaded successfully');
            },
            onError: () => {
                toast.error('Failed to upload signed document');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Signed Document</DialogTitle>
                    <DialogDescription>
                        Upload the signed PDF version of <span className="font-semibold">{document?.title}</span>.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="file">Signed PDF File</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                            required
                        />
                        {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.file}>
                            {processing ? 'Uploading...' : 'Upload & Mark as Signed'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
