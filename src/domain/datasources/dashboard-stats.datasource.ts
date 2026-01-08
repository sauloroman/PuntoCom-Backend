import { 
    DashboardKpis,
    ChartPoint,
    TopProductStats,
    ProductWithoutSales
} from "../../application/dtos/dashboard-stats.dto";

export abstract class DashboardStatsDatasource {
    abstract getKpis(): Promise<DashboardKpis>
    abstract getSalesByDate(): Promise<ChartPoint[]>
    abstract getPurchasesByDate(): Promise<ChartPoint[]>
    abstract getTopSellingProduct(): Promise<TopProductStats | null>
    abstract getProductsWithoutSales(): Promise<ProductWithoutSales[]>
}
