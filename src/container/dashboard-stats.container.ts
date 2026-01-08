import { DashboardStatsService } from "../application/services/dashboard-stats.service";
import { GetDashboardStatsUseCase, GetProductsWithoutSalesUseCase, GetPurchasesByDateUseCase, GetSalesByDateUseCase, GetTopSellingProductUseCase } from "../application/usecases/dashboard";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaDashboardStatsDatasource } from "../infrastructure/datasource/prisma/prisma-dashboard-stats.datasource";
import { DashboardStatsRepositoryImp } from "../infrastructure/repositories/dashboard-stats.repository.imp";
import { DashboardStatsController } from "../presentation/controllers/dashboard-stats.controller";
import { DashboardStatsRoutes } from "../presentation/routes";

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