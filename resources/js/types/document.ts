export interface Document {
    id: string;
    template_id: string;
    template?: { name: string };
    title: string;
    status: string;
    recipient_type: string;
    student?: { name: string };
    teacher?: { name: string };
    meta_data_values: Record<string, string>;
    created_at: string;
    creator?: { name: string };
}