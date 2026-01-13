import { DashboardStatsRepository } from "../../domain/repositories/dashboard-stats.repository";
import { DashboardStatsDatasource } from "../../domain/datasources/dashboard-stats.datasource";
import { SalesByUserStats } from "../../application/dtos/dashboard-stats.dto";

export class DashboardStatsRepositoryImp implements DashboardStatsRepository {

  constructor(
    private readonly datasource: DashboardStatsDatasource
  ) {}

  async getSalesPercentageByUser(): Promise<SalesByUserStats[]> {
    return this.datasource.getSalesPercentageByUser()
  }

  getKpis() {
    return this.datasource.getKpis();
  }

  getSalesByDate() {
    return this.datasource.getSalesByDate();
  }

  getPurchasesByDate() {
    return this.datasource.getPurchasesByDate();
  }

  getTopSellingProduct() {
    return this.datasource.getTopSellingProduct();
  }

  getProductsWithoutSales() {
    return this.datasource.getProductsWithoutSales();
  }
}
