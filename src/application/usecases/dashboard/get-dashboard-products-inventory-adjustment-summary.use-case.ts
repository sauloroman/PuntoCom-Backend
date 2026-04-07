import { DashboardStatsRepository } from "../../../domain/repositories";

export class GetInventoryAdjustmentSummaryUseCase {
    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}

    public async execute() {
        return await this.dashboardRepository.getInventoryAdjustmentSummary()
    }
}