import { DashboardStatsRepository } from "../../../domain/repositories";
import { PurchasesByCategory } from "../../dtos/dashboard-stats.dto";

export class GetPurchasesByCategoryUseCase {

    constructor(private readonly dashboardRepository: DashboardStatsRepository){}

    public async execute(): Promise<PurchasesByCategory[]> {
        return await this.dashboardRepository.getPurchasesByCategory()
    }

}