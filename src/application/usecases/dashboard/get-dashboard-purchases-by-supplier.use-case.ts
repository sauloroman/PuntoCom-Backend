import { DashboardStatsRepository } from "../../../domain/repositories";
import { PurchasesBySupplier } from "../../dtos/dashboard-stats.dto";

export class GetPurchasesBySupplierUseCase {

    constructor(private readonly dashboardRepository: DashboardStatsRepository ){}

    public async execute(): Promise<PurchasesBySupplier[]> {
        return await this.dashboardRepository.getPurchasesBySupplier()
    }

}