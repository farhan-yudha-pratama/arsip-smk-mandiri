export interface Template {
    id: number;
    name: string;
    url: string;
    meta_data: { [key: string]: any; };
    created_at: string;
}