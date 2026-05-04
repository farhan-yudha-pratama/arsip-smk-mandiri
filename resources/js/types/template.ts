export interface Template {
    id: number | string;
    name: string;
    url?: string;
    meta_data: string[] | { [key: string]: any; };
    created_at?: string;
}