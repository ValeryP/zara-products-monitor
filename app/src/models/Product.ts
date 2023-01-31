export interface Product {
    name?: string;
    price?: number;
    image?: string;
    url?: string;
    sizes?: Size[];
    monitorSizes?: SizeName[];
    updatedAt?: Date;
}

export type SizeName = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Size {
    name?: SizeName;
    is_available?: boolean;
    notes?: null;
}
