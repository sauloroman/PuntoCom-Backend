import { Router } from "express";
import { SupplierController } from "../controllers/supplier.controller";
import { Auth } from "../middlewares/auth";
import { ValidateRolesMiddleware } from "../middlewares";
import { RoleEnum } from "../../../generated/prisma";

interface SupplierRoutesI {
    controller: SupplierController
}

export class SupplierRoutes {

    public readonly routes: Router
    private readonly controller: SupplierController

    constructor({ controller }: SupplierRoutesI) {
        this.controller = controller
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([Auth.Logged])

        router.post('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.postSupplier )

        return router
    }

}