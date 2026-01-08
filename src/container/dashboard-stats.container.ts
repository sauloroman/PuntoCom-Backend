import { DashboardStatsService } from "../application/services"
import { 
    GetDashboardStatsUseCase, 
    GetProductsWithoutSalesUseCase, 
    GetPurchasesByDateUseCase, 
    GetSalesByDateUseCase, 
    GetTopSellingProductUseCase 
} from "../application/usecases/dashboard"
import { DashboardStatsController } from "../presentation/controllers"
import { DashboardStatsRoutes } from "../presentation/routes"

import { PrismaDashboardStatsDatasource, PrismaDatasource } from "../infrastructure/datasource/prisma"
import { DashboardStatsRepositoryImp } from "../infrastructure/repositories"

export class DashboardStatsContainer {

    public readonly dashboardStatsRoutes: DashboardStatsRoutes

    constructor() {

        const dashboardStatsRepository = new DashboardStatsRepositoryImp(
            new PrismaDashboardStatsDatasource( PrismaDatasource.getInstance() )
        )

        const getDashboardStatsUC = new GetDashboardStatsUseCase( dashboardStatsRepository )
        const getSalesChartUC = new GetSalesByDateUseCase( dashboardStatsRepository )
        const getPurchasesChartUC = new GetPurchasesByDateUseCase( dashboardStatsRepository )
        const getTopProductsUC = new GetTopSellingProductUseCase( dashboardStatsRepository )
        const getProductsWithoutSalesUC = new GetProductsWithoutSalesUseCase( dashboardStatsRepository )

        const dashboardStatsService = new DashboardStatsService({
            getDashboardStatsUC,
            getProductsWithoutSalesUC,
            getPurchasesChartUC,
            getSalesChartUC,
            getTopProductsUC
        })

        const dashboardStatsController = new DashboardStatsController(dashboardStatsService)

        this.dashboardStatsRoutes = new DashboardStatsRoutes({
            controller: dashboardStatsController
        })

    }

}