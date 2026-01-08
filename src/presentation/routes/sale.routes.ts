import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { SalesController } from "../controllers";
import { Auth, MapperFilterMiddleware, ValidateFiltersMiddleware, ValidateRolesMiddleware } from "../middlewares";

interface SaleRoutesI {
    controller: SalesController
}

export class SaleRoutes {
    public readonly routes: Router
    private readonly controller: SalesController

    constructor({ controller }: SaleRoutesI) {
        this.controller = controller
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()
        router.use([Auth.Logged])

        router.post('/', this.controller.saveSale )

        router.get('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            MapperFilterMiddleware.ToPrisma()
        ], this.controller.listSales )

        router.get('/filter', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            ValidateFiltersMiddleware.validateSaleFilters(),
            MapperFilterMiddleware.ToPrisma(),
        ], this.controller.filterSales )

        router.get('/:id', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador)
        ], this.controller.getSaleById)
        
        return router;  
    }

}