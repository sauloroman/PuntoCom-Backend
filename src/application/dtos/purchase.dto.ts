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

export interface PurchaseResponse {
    purchaseId: string,
    purchaseDate: string,
    puchaseTotal: number,
    Supplier?: {
        supplierId: string,
        supplierName: string,
        supplierPhone: string
    },
    User?: {
        userId: string,
        userName: string,
        userRole: string,
        userImage: string
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

export interface PurchaseDetailsReponse {
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

export interface PurchaseFilters {
    prices?: PurchasePriceFilter,
    dates?: PurchaseDateFilter,
    supplier?: string,
    user?: string
}