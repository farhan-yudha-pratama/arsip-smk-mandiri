import { Student, Teacher } from './user';

export interface Document {
    id: string;
    template_id: string;
    template?: { name: string };
    title: string;
    status: string;
    recipient_type: string;
    student?: Student;
    teacher?: Teacher;
    students: Student[];
    teachers: Teacher[];
    meta_data_values: Record<string, string>;
    category_numbering_id?: string | number;
    created_at: string;
    creator?: { name: string };
    is_batch: boolean;
    recipient_name?: string;
    incoming_mail?: {
        sender_origin: string;
        received_at: string;
    };
}