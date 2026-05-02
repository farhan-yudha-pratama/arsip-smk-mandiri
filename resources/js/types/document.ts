export interface Document {
    id: string;
    template?: { name: string };
    title: string;
    status: string;
    recipient_type: string;
    student?: { name: string };
    teacher?: { name: string };
    created_at: string;
    creator?: { name: string };
}