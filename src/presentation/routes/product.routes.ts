import { Router } from "express";
import { RoleEnum } from "../../../generated/prisma";
import { ProductController } from "../controllers/product.controller";
import { 
    Auth, 
    FileUploadMiddleware, 
    MapperFilterMiddleware, 
    ParamsHandlerMiddleware, 
    ValidateRolesMiddleware, 
    ValidateStockCriteriaMiddleware 
} from "../middlewares";

interface ProductRoutesI {
    controller: ProductController
    auth: Auth
}

export class ProductRoutes {

    public readonly routes: Router
    private readonly controller: ProductController
    private readonly auth: Auth

    constructor({ controller, auth }: ProductRoutesI) {
        this.controller = controller
        this.auth = auth
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([this.auth.Logged])
        
        router.get('/', this.controller.getAllProducts )

        router.get('/minimal', this.controller.getAllProductsMinimalInformation)
        
        router.get('/filter', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
        ], this.controller.filterProducts )

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