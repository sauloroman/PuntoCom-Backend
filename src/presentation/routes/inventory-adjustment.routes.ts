import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { InventoryAdjustmentController } from "../controllers";
import { Auth, MapperFilterMiddleware, ValidateRolesMiddleware } from "../middlewares";

interface InventoryAdjustmentRoutesI {
    controller:InventoryAdjustmentController 
}

export class InventoryAdjustmentRoutes {

    public readonly routes: Router
    private readonly controller: InventoryAdjustmentController

    constructor({ controller }: InventoryAdjustmentRoutesI){
        this.controller = controller
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([Auth.Logged])

        router.post('/', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor),
        ], this.controller.postInventoryAdjustment )
        
        router.get('/', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador, RoleEnum.Supervisor),
            MapperFilterMiddleware.ToPrisma()
        ], this.controller.getInventoryAdjustments )

        return router
    }

}