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

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function IncomingMailModal({ open, onOpenChange }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        sender_origin: '',
        received_at: new Date().toISOString().split('T')[0],
        file: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        post('/documents/incoming', {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success('Incoming mail registered successfully');
            },
            onError: () => {
                toast.error('Failed to register incoming mail');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Register Incoming Mail</DialogTitle>
                    <DialogDescription>
                        Enter details for external incoming documents.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Document Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Surat Undangan Rapat"
                            required
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sender_origin">Sender Name / Origin</Label>
                        <Input
                            id="sender_origin"
                            value={data.sender_origin}
                            onChange={(e) => setData('sender_origin', e.target.value)}
                            placeholder="e.g. Dinas Pendidikan"
                            required
                        />
                        {errors.sender_origin && <p className="text-xs text-destructive">{errors.sender_origin}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="received_at">Received Date</Label>
                        <Input
                            id="received_at"
                            type="date"
                            value={data.received_at}
                            onChange={(e) => setData('received_at', e.target.value)}
                            required
                        />
                        {errors.received_at && <p className="text-xs text-destructive">{errors.received_at}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="file">File (PDF/DOCX)</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                            required
                        />
                        {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Registering...' : 'Register Mail'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
