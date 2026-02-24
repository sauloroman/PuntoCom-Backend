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

export interface SaleRaw {
    sale_id: string
    sale_total: number,
    sale_date: Date | string,
    sale_code: string,
    user_id: string | null,
    user_name: string | null,
    user_lastname: string | null,
    user_role: string | null,
    user_image: string | null
}

export interface SaleDetailRaw {
    sale_product_detail_id: string,
    sale_product_detail_quantity: number,
    sale_product_detail_unit_price: number,
    sale_product_discount: number,
    sale_id: string,
    product_id: string,
    product_name: string,
    product_code: string
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
        role: string,
        image: string
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
