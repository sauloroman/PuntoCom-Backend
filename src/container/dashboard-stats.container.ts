import { DashboardStatsService } from "../application/services"
import { 
    GetDashboardKpisUseCase, 
    GetPurchasesSummaryUseCase, 
    GetProductsWithoutSalesUseCase, 
    GetPurchasesByDateUseCase, 
    GetPurchasesBySupplierUseCase, 
    GetSalesByCategoryUseCase, 
    GetSalesByDateUseCase,
    GetSalesByUserUseCase,
    GetSalesSummaryUseCase,
    GetTopSellingProductsUseCase,
    GetProductsByCriticalStock, 
} from "../application/usecases/dashboard"
import { DashboardStatsController } from "../presentation/controllers"
import { DashboardStatsRoutes } from "../presentation/routes"
import { DashboardStatsRepositoryImp } from "../infrastructure/repositories"
import { Auth } from "../presentation/middlewares"
import { ConnectionPool } from "mssql"
import { MSSQLStatsDashboard } from "../infrastructure/datasource/ms-sql/datasources"

export class DashboardStatsContainer {

    public readonly dashboardStatsRoutes: DashboardStatsRoutes

    constructor(private readonly pool: ConnectionPool ) {

        const dashboardStatsRepository = new DashboardStatsRepositoryImp( new MSSQLStatsDashboard(this.pool) )

        const getDashboardKpisUC = new GetDashboardKpisUseCase( dashboardStatsRepository )

        const getProductsByCriticalStockUC = new GetProductsByCriticalStock( dashboardStatsRepository )

        const getSalesSummaryUC = new GetSalesSummaryUseCase( dashboardStatsRepository )
        const getSalesByDateUC = new GetSalesByDateUseCase( dashboardStatsRepository )
        const getSalesByCategoryUC = new GetSalesByCategoryUseCase( dashboardStatsRepository )
        const getSalesByUserUC = new GetSalesByUserUseCase( dashboardStatsRepository )
        const getTopSellingProductsUC = new GetTopSellingProductsUseCase( dashboardStatsRepository )
        const getProductsWithoutSalesUC = new GetProductsWithoutSalesUseCase( dashboardStatsRepository ) 

        const getPurchasesSummaryUC = new GetPurchasesSummaryUseCase( dashboardStatsRepository )
        const getPurchasesByDateUC = new GetPurchasesByDateUseCase( dashboardStatsRepository )
        const getPurchasesBySupplierUC = new GetPurchasesBySupplierUseCase( dashboardStatsRepository )

        const dashboardStatsService = new DashboardStatsService({
            getDashboardKpisUC,
            getProductsWithoutSalesUC,
            getSalesByCategoryUC,
            getSalesByDateUC,
            getSalesByUserUC,
            getSalesSummaryUC,
            getTopSellingProductsUC,
            getPurchasesSummaryUC,
            getPurchasesByDateUC,
            getPurchasesBySupplierUC,
            getProductsByCriticalStockUC
        })

        const dashboardStatsController = new DashboardStatsController(dashboardStatsService)

        const auth = new Auth( this.pool )

        this.dashboardStatsRoutes = new DashboardStatsRoutes({
            controller: dashboardStatsController,
            auth: auth
        })

    }

}