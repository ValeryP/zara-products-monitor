export interface Product {
    name?: string;
    price?: number;
    image?: string;
    url?: string;
    sizes?: Size[];
    lastChecked?: Date;
    isLoading?: boolean;
}

export type SizeName = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Size {
    name?: SizeName;
    is_available?: boolean;
    notes?: string;
}
