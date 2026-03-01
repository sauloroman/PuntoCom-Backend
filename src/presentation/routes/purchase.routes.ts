import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { PurchasesController } from "../controllers";
import { Auth, MapperFilterMiddleware, ValidateRolesMiddleware } from "../middlewares";

interface PurchaseRoutesI {
    controller: PurchasesController
    auth: Auth
}

export class PurchaseRoutes {

    public readonly routes: Router
    private readonly controller: PurchasesController
    private readonly auth: Auth

    constructor({ controller, auth }: PurchaseRoutesI) {
        this.controller = controller
        this.auth = auth
        this.routes = this.initRoutes()
    }   

    private initRoutes(): Router {
        const router = Router()

        router.use([this.auth.Logged])

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