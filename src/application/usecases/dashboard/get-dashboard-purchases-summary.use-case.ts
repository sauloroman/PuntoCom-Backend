import { DashboardStatsRepository } from "../../../domain/repositories";
import { PurchaseSummary } from "../../dtos/dashboard-stats.dto";

export class GetPurchasesSummaryUseCase {

    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}

    public async execute(): Promise<PurchaseSummary> {
        return await this.dashboardRepository.getPurchaseSummary()
    }

}