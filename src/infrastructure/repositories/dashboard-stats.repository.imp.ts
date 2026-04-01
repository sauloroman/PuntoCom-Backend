import { DashboardStatsRepository } from "../../domain/repositories/dashboard-stats.repository";
import { DashboardStatsDatasource } from "../../domain/datasources/dashboard-stats.datasource";
import { ChartPoint, CriticalStockProduct, DashboardKpis, ProductsByCategory, ProductWithoutSales, PurchasesBySupplier, PurchaseSummary, SalesByCategory, SalesByUserStats, SalesSummary, TopProductStats } from "../../application/dtos/dashboard-stats.dto";

export class DashboardStatsRepositoryImp implements DashboardStatsRepository {

  constructor(private readonly datasource: DashboardStatsDatasource) {}

  async getKpis(): Promise<DashboardKpis> {
    return await this.datasource.getKpis()
  }

  async getSalesByDate(): Promise<ChartPoint[]> {
    return await this.datasource.getSalesByDate()
  }

  async getProductsWithoutSales(): Promise<ProductWithoutSales[]> {
    return await this.datasource.getProductsWithoutSales()
  }

  async getPurchasesByDate(): Promise<ChartPoint[]> {
    return await this.datasource.getPurchasesByDate()
  }

  async getSalesSummary(): Promise<SalesSummary> {
    return await this.datasource.getSalesSummary()
  }

  async getSalesByCategory(): Promise<SalesByCategory[]> {
    return await this.datasource.getSalesByCategory()
  }

  async getSalesByUser(): Promise<SalesByUserStats[]> {
    return await this.datasource.getSalesByUser()
  }

  async getTopSellingProducts(): Promise<TopProductStats[]> {
    return await this.datasource.getTopSellingProducts()
  }

  async getPurchaseSummary(): Promise<PurchaseSummary> {
    return await this.datasource.getPurchaseSummary()
  }

  async getPurchasesBySupplier(): Promise<PurchasesBySupplier[]> {
    return await this.datasource.getPurchasesBySupplier()
  }

  async getCriticalStockProducts(): Promise<CriticalStockProduct[]> {
    return await this.datasource.getCriticalStockProducts()
  }

  async getProductsByCategory(): Promise<ProductsByCategory[]> {
    return await this.datasource.getProductsByCategory()
  }
}
