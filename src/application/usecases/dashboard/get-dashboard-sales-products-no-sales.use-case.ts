import { DashboardStatsRepository } from "../../../domain/repositories";
import { ProductWithoutSales } from "../../dtos/dashboard-stats.dto";

export class GetProductsWithoutSalesUseCase {

    constructor(
        private readonly statsRepository: DashboardStatsRepository
    ){}

    public async execute(): Promise<ProductWithoutSales[]> {
        return await this.statsRepository.getProductsWithoutSales();
    }

}
