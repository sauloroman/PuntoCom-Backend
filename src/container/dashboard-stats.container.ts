import { DashboardStatsService } from "../application/services"
import { 
    GetDashboardSalesPercentageByUserUseCase,
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
import { Auth } from "../presentation/middlewares"
import { ConnectionPool } from "mssql"

export class DashboardStatsContainer {

    public readonly dashboardStatsRoutes: DashboardStatsRoutes

    constructor(private readonly pool: ConnectionPool ) {

        const dashboardStatsRepository = new DashboardStatsRepositoryImp(
            new PrismaDashboardStatsDatasource( PrismaDatasource.getInstance() )
        )

        const getDashboardStatsUC = new GetDashboardStatsUseCase( dashboardStatsRepository )
        const getSalesChartUC = new GetSalesByDateUseCase( dashboardStatsRepository )
        const getPurchasesChartUC = new GetPurchasesByDateUseCase( dashboardStatsRepository )
        const getTopProductsUC = new GetTopSellingProductUseCase( dashboardStatsRepository )
        const getProductsWithoutSalesUC = new GetProductsWithoutSalesUseCase( dashboardStatsRepository )
        const getSalesPercentageByUserUC = new GetDashboardSalesPercentageByUserUseCase( dashboardStatsRepository )

        const dashboardStatsService = new DashboardStatsService({
            getDashboardStatsUC,
            getProductsWithoutSalesUC,
            getPurchasesChartUC,
            getSalesChartUC,
            getTopProductsUC,
            getSalesPercentageByUserUC
        })

        const dashboardStatsController = new DashboardStatsController(dashboardStatsService)

        const auth = new Auth( this.pool )

        this.dashboardStatsRoutes = new DashboardStatsRoutes({
            controller: dashboardStatsController,
            auth: auth
        })

    }

}