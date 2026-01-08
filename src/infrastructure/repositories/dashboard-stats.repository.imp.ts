import { DashboardStatsRepository } from "../../domain/repositories/dashboard-stats.repository";
import { DashboardStatsDatasource } from "../../domain/datasources/dashboard-stats.datasource";

export class DashboardStatsRepositoryImp implements DashboardStatsRepository {

  constructor(
    private readonly datasource: DashboardStatsDatasource
  ) {}

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
