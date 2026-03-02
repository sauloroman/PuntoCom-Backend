import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { SupplierController } from "../controllers";
import { Auth, MapperFilterMiddleware, ParamsHandlerMiddleware, ValidateRolesMiddleware } from "../middlewares";

interface SupplierRoutesI {
    controller: SupplierController
    auth: Auth
}

export class SupplierRoutes {

    public readonly routes: Router
    private readonly controller: SupplierController
    private readonly auth: Auth

    constructor({ controller, auth }: SupplierRoutesI) {
        this.controller = controller
        this.auth = auth
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([this.auth.Logged])

        router.get('/', this.controller.getAllSuppliers )

        router.get('/companies', this.controller.getUniqueCompanies )

        router.post('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.postSupplier )

        router.get('/filter', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
        ], this.controller.filterSuppliers )

        router.get('/:id', [
            ParamsHandlerMiddleware.hasIDItem(),
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor )
        ], this.controller.getSupplierById )

        router.put('/:id', [
            ParamsHandlerMiddleware.hasIDItem(),
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.updateSupplier )

        router.patch('/deactivate/:id', [
            ParamsHandlerMiddleware.hasIDItem(),
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ) 
        ], this.controller.deactivateSupplier )

        router.patch('/activate/:id', [
            ParamsHandlerMiddleware.hasIDItem(),
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ) 
        ], this.controller.activateSupplier )

        return router
    }

}