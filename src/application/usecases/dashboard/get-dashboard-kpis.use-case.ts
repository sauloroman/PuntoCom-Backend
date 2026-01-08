import { DashboardStatsRepository } from "../../../domain/repositories";
import { DashboardKpis } from "../../dtos/dashboard-stats.dto";

export class GetDashboardKpisUseCase {

    constructor(
        private readonly statsRepository: DashboardStatsRepository
    ){}

    public async execute(): Promise<DashboardKpis> {
        return await this.statsRepository.getKpis();
    }

}
