import { Router } from "express";
import { PurchasesController } from "../controllers/purchases.controller";
import { Auth } from "../middlewares/auth";
import { MapperFilterMiddleware, ValidateRolesMiddleware } from "../middlewares";
import { RoleEnum } from "../../../generated/prisma";

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
        ], this.controller.getPurchases)

        router.get('/filter', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ),
            MapperFilterMiddleware.ToPrisma()
        ], this.controller.listPurchases )

        return router
    }

}