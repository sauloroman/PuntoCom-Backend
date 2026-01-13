import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { DashboardStatsController } from "../controllers";
import { ValidateRolesMiddleware } from "../middlewares";
import { Auth } from "../middlewares";

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

        router.get('/sales-percentage-users', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor)
        ], this.controller.getSalesPercentagesByUser )

        return router
    }

}