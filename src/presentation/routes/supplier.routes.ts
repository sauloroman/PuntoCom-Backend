import { Router } from "express";
import { SupplierController } from "../controllers/supplier.controller";
import { Auth } from "../middlewares/auth";
import { MapperFilterMiddleware, ParamsHandlerMiddleware, ValidateRolesMiddleware } from "../middlewares";
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

        router.get('/companies', this.controller.getUniqueCompanies )

        router.post('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.postSupplier )

        router.get('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            MapperFilterMiddleware.ToPrisma()
        ], this.controller.getSuppliers )

        router.get('/search', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            MapperFilterMiddleware.ToPrismaContains()
        ], this.controller.getSuppliers )

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