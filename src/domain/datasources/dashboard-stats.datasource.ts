import { 
    DashboardKpis,
    ChartPoint,
    TopProductStats,
    ProductWithoutSales,
    SalesByUserStats,
    SalesSummary,
    SalesByCategory,
    PurchaseSummary,
    PurchasesBySupplier,
    CriticalStockProduct,
    ProductsByCategory,
    InventoryAdjustmentSummary,
    MostAdjustedProduct,
    TopPurchasedProduct,
    PurchasesByCategory
} from "../../application/dtos/dashboard-stats.dto";

export abstract class DashboardStatsDatasource {
    abstract getKpis(): Promise<DashboardKpis>
    
    abstract getSalesSummary(): Promise<SalesSummary>
    abstract getSalesByDate(): Promise<ChartPoint[]>
    abstract getSalesByCategory(): Promise<SalesByCategory[]>
    abstract getSalesByUser(): Promise<SalesByUserStats[]>
    abstract getTopSellingProducts(): Promise<TopProductStats[]>
    abstract getProductsWithoutSales(): Promise<ProductWithoutSales[]>
    
    abstract getPurchaseSummary(): Promise<PurchaseSummary>
    abstract getPurchasesByDate(): Promise<ChartPoint[]>
    abstract getPurchasesBySupplier(): Promise<PurchasesBySupplier[]>
    abstract getTopPurchasedProducts(): Promise<TopPurchasedProduct[]>
    abstract getPurchasesByCategory(): Promise<PurchasesByCategory[]>

    abstract getCriticalStockProducts(): Promise<CriticalStockProduct[]>
    abstract getProductsByCategory(): Promise<ProductsByCategory[]>
    abstract getInventoryAdjustmentSummary(): Promise<InventoryAdjustmentSummary>
    abstract getMostAdjustedProducts(): Promise<MostAdjustedProduct[]>
}
