import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { DashboardStatsController } from "../controllers";
import { ValidateRolesMiddleware } from "../middlewares";
import { Auth } from "../middlewares";

interface DashboardStatsRoutesI {
    controller: DashboardStatsController,
    auth: Auth
}

export class DashboardStatsRoutes {

    public readonly routes: Router
    private readonly auth: Auth
    private readonly controller: DashboardStatsController

    constructor({ controller, auth }: DashboardStatsRoutesI){
        this.controller = controller
        this.auth = auth
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([this.auth.Logged])

        router.get('/kpis', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor)
        ], this.controller.getKPISStats)

        router.get('/sales', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor)
        ], this.controller.getSalesStats )

        router.get('/purchases', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador)
        ], this.controller.getPurchasesStats )
        
        router.get('/products', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador)
        ], this.controller.getProductsStats )

        return router
    }

}