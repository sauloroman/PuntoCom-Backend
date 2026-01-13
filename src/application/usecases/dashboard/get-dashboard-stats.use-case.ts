import { DashboardStatsRepository } from "../../../domain/repositories";
import { DashboardStats } from "../../dtos/dashboard-stats.dto";

export class GetDashboardStatsUseCase {

    constructor(private readonly statsRepository: DashboardStatsRepository){}

    public async execute(): Promise<DashboardStats> {

        const [ kpis, salesByDate, purchasesByDate, topProduct, productsWithoutSales, salesPercentageByUser ] = await Promise.all([
            this.statsRepository.getKpis(),
            this.statsRepository.getSalesByDate(),
            this.statsRepository.getPurchasesByDate(),
            this.statsRepository.getTopSellingProduct(),
            this.statsRepository.getProductsWithoutSales(),
            this.statsRepository.getSalesPercentageByUser()
        ])

        return {
            kpis,
            charts: {
                salesByDate,
                purchasesByDate,
                salesPercentageByUser,
            },
            insights: {
                topProduct,
                productsWithoutSales,
            }
        }
        
    }

}