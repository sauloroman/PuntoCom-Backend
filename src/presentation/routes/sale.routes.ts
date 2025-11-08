import { Router } from "express";
import { SalesController } from "../controllers/sales.controller";
import { Auth } from "../middlewares/auth";
import { MapperFilterMiddleware, ValidateFiltersMiddleware, ValidateRolesMiddleware } from "../middlewares";
import { RoleEnum } from "../../../generated/prisma";

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

        router.get('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            MapperFilterMiddleware.ToPrisma()
        ], this.controller.getSales )

        router.get('/user/:id', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            MapperFilterMiddleware.ToPrisma()
        ], this.controller.getSalesByUser )
        
        router.get('/filter', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            ValidateFiltersMiddleware.validateSaleFilters(),
            MapperFilterMiddleware.ToPrisma(),
        ], this.controller.getFilteredSales )
        
        router.get('/filter/user/:id', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            ValidateFiltersMiddleware.validateSaleFilters(),
            MapperFilterMiddleware.ToPrisma(),
        ], this.controller.getFilteredSalesByUser )
        
        router.post('/', this.controller.saveSale )

        return router;  
    }

}