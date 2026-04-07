import { DashboardStatsRepository } from "../../../domain/repositories";

export class GetProductsMostAdjusted {
    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}
    
    public async execute() {
        return await this.dashboardRepository.getMostAdjustedProducts()
    }
}