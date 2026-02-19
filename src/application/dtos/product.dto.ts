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

export interface ProductInfo {
    productId: string,
    productName: string,
    productStock: number
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

export interface ProductRaw {
    product_id: string,
    product_name: string,
    product_description: string,
    product_code: string,
    product_selling_price: number,
    product_stock: number,
    product_stock_min: number,
    product_image: string,
    product_image_code: string,
    product_createdAt: Date,
    product_updatedAt: Date,
    product_is_active: boolean,
    category_id: string,
    supplier_id: string,
    category_name: string | null,
    category_description: string | null,
    category_icon: string | null,
    category_is_active: boolean | null,
    supplier_name: string | null,
    supplier_lastname: string | null,
    supplier_company: string | null,
    supplier_phone: string | null,
    supplier_email: string | null,
    supplier_address: string | null,
    supplier_is_active: boolean | null,
}

export enum StockCriteria {
    low = 'low',
    warning = 'warning',
    normal = 'normal'
}