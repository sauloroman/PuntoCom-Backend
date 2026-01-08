import { DashboardStatsRepository } from "../../../domain/repositories/dashboard-stats.repository";
import { ChartPoint } from "../../dtos/dashboard-stats.dto";

export class GetPurchasesByDateUseCase {

    constructor(
        private readonly statsRepository: DashboardStatsRepository
    ){}

    public async execute(): Promise<ChartPoint[]> {
        return await this.statsRepository.getPurchasesByDate();
    }

}
