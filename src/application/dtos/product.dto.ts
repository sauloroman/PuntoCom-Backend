export interface CreateProduct {
    name: string,
    description?: string,
    sellingPrice: number,
    stock: number,
    stockMin: number,
    categoryId: string,
    supplierId: string
}

export interface UpdateProductRequest {
    id: string,
    imageCode?: string,
    name?: string,
    description?: string,
    sellingPrice?: number,
    stock?: number,
    stockMin?: number,
    categoryId?: string,
    supplierId?: string,
}

export interface UpdateProductRequestDto {
    name?: string,
    description?: string,
    sellingPrice?: number,
    stock?: number,
    stockMin?: number,
    categoryId?: string,
    supplierId?: string,
}

export interface UpdateProductImageDto {
    id: string,
    url: string
}

export interface ProductResponseDto {
    id: string,
    name: string,
    description: string,
    sellingPrice: number,
    stock: number,
    stockMin: number,
    image: string,
    code: string,
    categoryId: string,
    supplierId: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface ChangeStatusDto {
    id: string,
    status: boolean
}

export interface ProductResponseIncludeDto {
    id: string,
    name: string,
    description: string,
    sellingPrice: number,
    stock: number,
    stockMin: number,
    image: string,
    imageCode: string,
    code: string,
    categoryId: string,
    supplierId: string,
    isActive: boolean,
    createdAt: string | Date,
    updatedAt: string | Date,
    Category?: {
        id: string,
        name: string,
        description: string,
        icon: string,
        isActive: boolean
    },
    Supplier?: {
        id: string,
        name: string,
        lastname: string,
        company: string,
        phone: string,
        email: string,
        address: string,
        isActive: boolean,
    }
}

export enum StockCriteria {
    low = 'low',
    warning = 'warning',
    normal = 'normal'
}