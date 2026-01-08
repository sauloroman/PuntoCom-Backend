import { Router } from "express";
import { DashboardStatsController } from "../controllers/dashboard-stats.controller";
import { ValidateRolesMiddleware } from "../middlewares";
import { RoleEnum } from "../../../generated/prisma";
import { Auth } from "../middlewares/auth";

interface DashboardStatsRoutesI {
    controller: DashboardStatsController
}

export class DashboardStatsRoutes {

    public readonly routes: Router
    private readonly controller: DashboardStatsController

    constructor({ controller }: DashboardStatsRoutesI){
        this.controller = controller
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([Auth.Logged])

        router.get('/stats', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor)
        ], this.controller.getGeneralStats)

        router.get('/sales-chart', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor)
        ], this.controller.getSalesChart)

        router.get('/purchases-chart', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor)
        ], this.controller.getPurchasesChart)

        router.get('/top-products', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor)
        ], this.controller.getTopProducts)

        router.get('/products-without-sales', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor)
        ], this.controller.getProductsWithoutSales)

        return router
    }

}