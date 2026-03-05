export interface SavePurchase {
    total: number,
    userId: string,
    supplierId: string
}

export interface SavePurchaseDetail {
    productId: string,
    quantity: number,
    unitPrice: number
}

export interface PurchaseRaw {
    purchase_id: string,
    purchase_total: number,
    purchase_date: Date | string,
    user_id: string | null,
    user_name: string | null,
    user_lastname: string | null,
    role: string | null,
    user_image: string | null,
    supplier_id: string,
    supplier_name: string | null,
    supplier_lastname: string | null,
    supplier_phone: string | null
}

export interface PurchaseDetailRaw {
    purchase_detail_id: string,
    purchase_quantity: number,
    purchase_unit_price: number,
    purchase_id: string,
    product_id: string,
    product_name: string,
    product_image: string
}

export interface PurchaseResponse {
    purchaseId: string,
    purchaseDate: string,
    puchaseTotal: number,
    Supplier?: {
        id: string,
        name: string,
        phone: string
    },
    User?: {
        id: string,
        name: string,
        role: string,
        image: string
    }
}

export interface PurchaseDetailResponse {
    id: string,
    purchaseQuantity: number,
    purchaseUnitPrice: number,
    productId: string,
    purchaseId: string,
    Product?: {
        productId: string,
        productName: string,
        productImage: string
    }
}

export interface PurchaseDetailsResponse {
    purchase: PurchaseResponse,
    details: PurchaseDetailResponse[]
}

export interface PurchasePriceFilter {
    minPrice: number,
    maxPrice: number
}

export interface PurchaseDateFilter {
    dateFrom: Date,
    dateTo: Date
}

export interface FilterPurchase {
    prices?: PurchasePriceFilter,
    dates?: PurchaseDateFilter,
    supplier?: string,
    user?: string
}