import { DashboardStatsRepository } from "../../../domain/repositories";
import { TopPurchasedProduct } from "../../dtos/dashboard-stats.dto";

export class GetTopPurchasedProductsUseCase {

    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}

    public async execute(): Promise<TopPurchasedProduct[]> {
        return await this.dashboardRepository.getTopPurchasedProducts()
    }

}