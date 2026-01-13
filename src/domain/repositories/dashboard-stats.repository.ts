import { 
    DashboardKpis,
    ChartPoint,
    TopProductStats,
    ProductWithoutSales,
    SalesByUserStats
} from "../../application/dtos/dashboard-stats.dto";

export abstract class DashboardStatsRepository {
    abstract getKpis(): Promise<DashboardKpis>
    abstract getSalesByDate(): Promise<ChartPoint[]>
    abstract getPurchasesByDate(): Promise<ChartPoint[]>
    abstract getTopSellingProduct(): Promise<TopProductStats | null>
    abstract getProductsWithoutSales(): Promise<ProductWithoutSales[]>
    abstract getSalesPercentageByUser(): Promise<SalesByUserStats[]>
}
