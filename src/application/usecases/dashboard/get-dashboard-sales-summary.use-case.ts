import { DashboardStatsRepository } from "../../../domain/repositories";
import { SalesSummary } from "../../dtos/dashboard-stats.dto";

export class GetSalesSummaryUseCase {

    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}

    public async execute(): Promise<SalesSummary> {
        return await this.dashboardRepository.getSalesSummary()
    }

}