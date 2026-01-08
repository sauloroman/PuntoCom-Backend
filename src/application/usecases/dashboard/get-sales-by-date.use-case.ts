import { DashboardStatsRepository } from "../../../domain/repositories";
import { ChartPoint } from "../../dtos/dashboard-stats.dto";

export class GetSalesByDateUseCase {

    constructor(
        private readonly statsRepository: DashboardStatsRepository
    ){}

    public async execute(): Promise<ChartPoint[]> {
        return await this.statsRepository.getSalesByDate();
    }

}
