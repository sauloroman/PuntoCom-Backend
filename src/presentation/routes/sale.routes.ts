import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { SalesController } from "../controllers";
import { Auth, MapperFilterMiddleware, ValidateFiltersMiddleware, ValidateRolesMiddleware } from "../middlewares";

interface SaleRoutesI {
    controller: SalesController
    auth: Auth
}

export class SaleRoutes {
    public readonly routes: Router
    private readonly controller: SalesController
    private readonly auth: Auth

    constructor({ controller, auth }: SaleRoutesI) {
        this.controller = controller
        this.auth = auth
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([this.auth.Logged])

        router.post('/', this.controller.saveSale )

        router.get('/filter', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
        ], this.controller.filterSales )

        router.get('/:id', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador)
        ], this.controller.getSaleById)
        
        return router;  
    }

}