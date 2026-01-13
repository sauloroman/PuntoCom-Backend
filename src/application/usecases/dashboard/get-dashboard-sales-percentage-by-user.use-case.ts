import { DashboardStatsRepository } from "../../../domain/repositories";
import { SalesByUserStats } from "../../dtos/dashboard-stats.dto";

export class GetDashboardSalesPercentageByUserUseCase {

    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}

    public async execute(): Promise<SalesByUserStats[]> {
        return await this.dashboardRepository.getSalesPercentageByUser()
    }

}