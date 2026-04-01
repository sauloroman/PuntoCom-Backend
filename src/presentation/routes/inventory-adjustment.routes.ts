import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { InventoryAdjustmentController } from "../controllers";
import { Auth, ValidateRolesMiddleware } from "../middlewares";

interface InventoryAdjustmentRoutesI {
    controller:InventoryAdjustmentController
    auth: Auth
}

export class InventoryAdjustmentRoutes {

    public readonly routes: Router
    private readonly controller: InventoryAdjustmentController
    private readonly auth: Auth

    constructor({ controller, auth }: InventoryAdjustmentRoutesI){
        this.controller = controller
        this.auth = auth
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([this.auth.Logged])

        router.post('/', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor),
        ], this.controller.postInventoryAdjustment )
        
        router.get('/filter', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor),
        ], this.controller.filterInventoryAdjustments )

        return router
    }

}