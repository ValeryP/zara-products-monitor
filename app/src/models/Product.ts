export interface Product {
    name?: string;
    price?: number;
    image?: string;
    url: string;
    sizes?: Size[];
    lastChecked?: Date;
    createdAt?: Date;
    status?: Status;
}

export type Status = 'LOADING' | 'SUCCESS' | 'ERROR';

export interface Size {
    name?: string;
    is_available?: boolean;
    notes?: string;
}
