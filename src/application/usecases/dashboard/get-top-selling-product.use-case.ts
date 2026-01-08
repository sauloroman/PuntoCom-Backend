import { DashboardStatsRepository } from "../../../domain/repositories/dashboard-stats.repository";
import { TopProductStats } from "../../dtos/dashboard-stats.dto";

export class GetTopSellingProductUseCase {

    constructor(
        private readonly statsRepository: DashboardStatsRepository
    ){}

    public async execute(): Promise<TopProductStats | null> {
        return await this.statsRepository.getTopSellingProduct();
    }

}
