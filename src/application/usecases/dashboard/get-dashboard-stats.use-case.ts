import { DashboardStatsRepository } from "../../../domain/repositories/dashboard-stats.repository";
import { DashboarStats } from "../../dtos/dashboard-stats.dto";

export class GetDashboardStatsUseCase {

    constructor(private readonly statsRepository: DashboardStatsRepository){}

    public async execute(): Promise<DashboarStats> {

        const [ kpis, salesByDate, purchasesByDate, topProduct, productsWithoutSales ] = await Promise.all([
            this.statsRepository.getKpis(),
            this.statsRepository.getSalesByDate(),
            this.statsRepository.getPurchasesByDate(),
            this.statsRepository.getTopSellingProduct(),
            this.statsRepository.getProductsWithoutSales()
        ])

        return {
            kpis,
            charts: {
                salesByDate,
                purchasesByDate
            },
            insights: {
                topProduct,
                productsWithoutSales
            }
        }
        
    }

}