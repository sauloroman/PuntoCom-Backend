// Sale Creation
export interface SaveSale {
    total: number,
    userId: string, 
}

export interface SaleDetail {
    productId: string,
    quantity: number,
    unitPrice: number,
    discount: number
}

export interface SaleProductDetail {
    id: string,
    saleQuantity: number,
    saleUnitPrice: number,
    saleDiscount: number,
    productId: string,
    saleId: string,
}

// Sale Filter

export interface SalePriceRange {
    minPrice: number,
    maxPrice: number
}

export interface SaleDateRange {
    dateFrom: Date,
    dateTo: Date
}

export interface SaleFilters {
    prices?: SalePriceRange,
    dates?: SaleDateRange,
    user?: string
}

// Responses

export interface SaleResponse {
    saleId: string
    saleDate: Date | string,
    saleTotal: number,
    saleCode: string,
    User?: {
        id: string,
        name: string,
        role: string
    }
}

export interface SaleProductDetailResponse {
    id: string,
    saleQuantity: number,
    saleUnitPrice: number,
    saleDiscount: number,
    productId: string,
    saleId: string,
    Product?: {
        id: string,
        name: string,
        code: string
    }
}

export interface SaleDetailsResponse {
    sale: SaleResponse,
    details: SaleProductDetailResponse[]
}
