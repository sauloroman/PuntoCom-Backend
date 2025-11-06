import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { Auth } from "../middlewares/auth";
import { FileUploadMiddleware, MapperFilterMiddleware, ParamsHandlerMiddleware, ValidateRolesMiddleware, ValidateStockCriteriaMiddleware } from "../middlewares";
import { RoleEnum } from "../../../generated/prisma";

interface ProductRoutesI {
    controller: ProductController
}

export class ProductRoutes {

    public readonly routes: Router
    private readonly controller: ProductController

    constructor({ controller }: ProductRoutesI) {
        this.controller = controller
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([Auth.Logged])

        router.get('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            MapperFilterMiddleware.ToPrisma()
        ], this.controller.getProducts )

        router.get('/search', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
            MapperFilterMiddleware.ToPrismaContains()
        ], this.controller.getProducts )

        router.get('/:id', this.controller.getProductById )
            
        router.post('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.createProduct )

        router.put('/:id', [
            ParamsHandlerMiddleware.hasIDItem(),
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.updateProduct )

        router.patch('/deactivate/:id', [
            ParamsHandlerMiddleware.hasIDItem(),
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.deactivateProduct )
        
        router.patch('/activate/:id', [
            ParamsHandlerMiddleware.hasIDItem(),
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.activateProduct )

        router.patch('/upload-image/:id', [
            ParamsHandlerMiddleware.hasIDItem(),
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ),
            FileUploadMiddleware.validateContainFiles
        ], this.controller.uploadProductImage )

        router.get('/stock/:criteria', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor),
            ValidateStockCriteriaMiddleware.validate(),
        ], this.controller.getProductsByStock)

        return router
    }

}