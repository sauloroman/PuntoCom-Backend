// KPIS
export interface DashboardKpis {
    totalSales: number
    totalPurchases: number
    netProfit: number,
    criticalStockProducts: number,
    totalActiveProducts: number,
    totalStockValue: number,
    totalActiveUsers: number
}

export interface ChartPoint {
    date: string
    total: number
}

// Sales
export interface SalesSummary {
    totalOrders: number,
    averageOrderValue: number,
    maxOrderValue: number,
    minOrderValue: number
}

export interface SalesByCategory {
    categoryId: string,
    categoryName: string,
    categoryIcon: string,
    totalSales: number,
    quantitySold: number,
    percetage: number
}

// Purchases
export interface PurchaseSummary {
    totalOrders: number,
    averageOrderValue: number,
    maxOrderValue: number,
    minOrderValue: number
}

export interface PurchasesBySupplier {
    supplierId: string,
    supplierCompany: string,
    totalPurchases: number,
    ordersCount: number,
    percentage: number
}

// Products
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

export interface CriticalStockProduct {
    productId: string,
    productName: string,
    stock: number,
    stockMin: number,
    stockValue: number
}

export interface ProductsByCategory {
    categoryId: string,
    categoryName: string,
    categoryIcon: string,
    productCount: number,
    activeProductCount: number
}

// Users
export interface SalesByUserStats {
    userId: string
    userName: string,
    role: string,
    totalSales: number,
    ordersCount: number,
    averageOrderValue: number,
    percentage: number
}

// Inventory Adjustment
export interface InventoryAdjustmentSummary {
    totalAdjustments: number
    totalEntradas: number
    totalSalidas: number
    totalUnitsAdded: number         
    totalUnitsRemoved: number
}

export interface MostAdjustedProduct {
    productId: string
    productName: string
    adjustmentCount: number
    totalUnitsAdded: number
    totalUnitsRemoved: number
}

// Response
export interface DashboardStats {
    kpis: DashboardKpis,

    sales: {
        summary: SalesSummary,
        byDate: ChartPoint[],
        byCategory: SalesByCategory[],
        byUser: SalesByUserStats[],
        topProducts: TopProductStats[],
        productsWithoutSales: ProductWithoutSales[],
    }

    purchases: {
        summary: PurchaseSummary,
        byDate: ChartPoint[],
        bySupplier: PurchasesBySupplier[],
    }

    products: {
        criticalStock: CriticalStockProduct[],
        byCategory: ProductsByCategory[]
    },

    inventory: {
        summary: InventoryAdjustmentSummary,
        mostAdjusted: MostAdjustedProduct[]
    }
}