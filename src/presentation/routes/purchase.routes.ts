import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { PurchasesController } from "../controllers";
import { Auth, MapperFilterMiddleware, ValidateRolesMiddleware } from "../middlewares";

interface PurchaseRoutesI {
    controller: PurchasesController
}

export class PurchaseRoutes {

    public readonly routes: Router
    private readonly controller: PurchasesController

    constructor({ controller }: PurchaseRoutesI) {
        this.controller = controller
        this.routes = this.initRoutes()
    }   

    private initRoutes(): Router {
        const router = Router()

        router.use([Auth.Logged])

        router.post('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )   
        ], this.controller.savePurchase)
        
        router.get('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ),
            MapperFilterMiddleware.ToPrisma()  
        ], this.controller.listPurchases)

        router.get('/filter', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ),
            MapperFilterMiddleware.ToPrisma()
        ], this.controller.filterPurchases )

        return router
    }

}