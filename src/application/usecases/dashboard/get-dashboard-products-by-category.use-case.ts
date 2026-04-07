import { DashboardStatsRepository } from "../../../domain/repositories";

export class GetProductsByCategoryUseCase {
    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}

    public async execute() {
        return await this.dashboardRepository.getProductsByCategory()
    }
}