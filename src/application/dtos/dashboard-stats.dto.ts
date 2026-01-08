export interface DashboardKpis {
    totalSales: number
    totalPurchases: number
    criticalStockProducts: number
}

export interface ChartPoint {
    date: string
    total: number
}

export interface TopProductStats {
    productId: string
    productName: string
    quantitySold: number
    totalGenerated: number
}

export interface ProductWithoutSales {
    productId: string
    productName: string
    stock: number
}

export interface DashboardStats {
    kpis: DashboardKpis,
    charts: {
        salesByDate: ChartPoint[],
        purchasesByDate: ChartPoint[]
    },
    insights: {
        topProduct: TopProductStats | null,
        productsWithoutSales: ProductWithoutSales[]
    }
}