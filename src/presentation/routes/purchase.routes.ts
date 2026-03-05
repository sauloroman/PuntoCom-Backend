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

        router.use([
            this.auth.Logged,
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )   
        ])

        router.post('/', this.controller.savePurchase)
        router.get('/filter', this.controller.filterPurchases )
        router.get('/:id', this.controller.getPurchaseById)

        return router
    }

}