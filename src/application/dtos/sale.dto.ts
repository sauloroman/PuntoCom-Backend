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

export interface SaleResponse {
    id: string
    date: Date,
    total: number,
    code: string,
    User?: {
        id: string,
        name: string,
        role: string
    }
}

export interface SaleDetailsResponse {
    id: string
    date: Date | string,
    total: number,
    code: string,
    User?: {
        id: string,
        name: string,
        role: string
    },
    details: SaleProductDetailResponse[]
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

export interface SaleProductDetail {
    id: string,
    saleQuantity: number,
    saleUnitPrice: number,
    saleDiscount: number,
    productId: string,
    saleId: string,
}