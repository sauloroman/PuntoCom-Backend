import { DashboardStatsRepository } from "../../../domain/repositories";
import { TopProductStats } from "../../dtos/dashboard-stats.dto";

export class GetTopSellingProductsUseCase {
    constructor( private readonly statsRepository: DashboardStatsRepository ){}

    public async execute(): Promise<TopProductStats[]> {
        return await this.statsRepository.getTopSellingProducts();
    }
}
