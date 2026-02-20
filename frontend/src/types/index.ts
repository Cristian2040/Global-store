// API Types
export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'customer' | 'admin' | 'store' | 'supplier' | 'company';
    active: boolean;
    address?: Address;
    createdAt: string;
}

export interface Address {
    country?: string;
    state?: string;
    municipality?: string;
    neighborhood?: string;
    street?: string;
    number?: string;
    notes?: string;
}

export interface Store {
    _id: string;
    userId: string;
    storeName: string;
    ownerName: string;
    description?: string;
    address?: Address;
    phone?: string;
    schedule?: string;
    logo?: string;
    rating?: number;
    active: boolean;
    orderOptions?: {
        pickupEnabled?: boolean;
        deliveryEnabled?: boolean;
        allowScheduledOrders?: boolean;
        deliveryConfig?: {
            feeCents?: number;
            minOrderCents?: number;
            etaMinMinutes?: number;
            etaMaxMinutes?: number;
        };
    };
    paymentMethods?: {
        method: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
        enabled: boolean;
        label?: string;
        notes?: string;
    }[];
}


export interface Company {
    _id: string;
    userId: string;
    companyName: string;
    contactEmail: string;
    phone: string;
    address?: Address;
    description?: string;
    active: boolean;
}

export interface Supplier {
    _id: string;
    userId: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    address?: Address;
    categories?: string[];
    status?: 'PENDING' | 'ACTIVE' | 'REJECTED';
    active: boolean;
}

export interface Product {
    _id: string;
    name: string;
    category?: string;
    company?: string;
    unit?: string;
    barcode?: string;
    image?: string;
    description?: string;
}

export interface StoreProduct {
    _id: string;
    storeId: string;
    productId: Product;
    basePriceCents: number;
    finalPriceCents: number;
    availableQuantity: number;
    expiryDate?: string;
    active: boolean;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        expiresIn: string;
        relatedData?: Store | Supplier | Company;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any[];
}

// Form Types
export interface RegisterFormData {
    // Step 1
    role: 'customer' | 'store' | 'supplier' | 'company';

    // Step 2
    username: string;
    email: string;
    password: string;
    confirmPassword: string;

    // Step 3 - Customer
    address?: Address;

    // Step 3 - Store
    storeName?: string;
    ownerName?: string;
    storePhone?: string;
    storeAddress?: Address;

    // Supplier specific
    supplierName?: string;
    companyId?: string;
    supplierPhone?: string;
    categories?: string[];
    description?: string;
    website?: string;
    logo?: string;

    // Restore missing fields if accidentaly removed
    supplierEmail?: string;
    companyEmail?: string;
    companyName?: string;
    companyPhone?: string;
    companyAddress?: Address;
}

export interface LoginFormData {
    email: string;
    password: string;
}
