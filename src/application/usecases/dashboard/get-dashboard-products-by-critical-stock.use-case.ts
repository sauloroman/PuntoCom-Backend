import { DashboardStatsRepository } from "../../../domain/repositories";
import { CriticalStockProduct } from "../../dtos/dashboard-stats.dto";

export class GetProductsByCriticalStock {

    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}

    public async execute(): Promise<CriticalStockProduct[]> {
        return await this.dashboardRepository.getCriticalStockProducts()
    }

}