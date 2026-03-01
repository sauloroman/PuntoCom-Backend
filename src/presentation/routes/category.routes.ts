import { Router } from "express";
import { CategoryController } from "../controllers";
import { Auth, FileUploadMiddleware, ParamsHandlerMiddleware, ValidateRolesMiddleware } from "../middlewares";
import { RoleEnum } from "../../../generated/prisma";

interface CategoryRoutesI {
    controller: CategoryController,
    auth: Auth
}

export class CategoryRoutes {

    public readonly routes: Router
    private readonly auth: Auth
    private readonly controller: CategoryController

    constructor({ controller, auth }: CategoryRoutesI){
        this.controller = controller
        this.auth = auth
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        // ############# Private Routes #############
        
        router.use([this.auth.Logged])

        router.get('/', this.controller.getAllCategories)
        
        router.get('/filter', this.controller.filterCategories )

        router.patch('/upload-image/:id', [ 
            ParamsHandlerMiddleware.hasIDItem(),
            FileUploadMiddleware.validateContainFiles 
        ], this.controller.uploadCategoryImage )
        
        // ############# Only Admin Private Routes #############
        
        router.use([ ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ) ])

        router.post('/', this.controller.createCategory )

        router.get('/:id', [
            ParamsHandlerMiddleware.hasIDItem()
        ], this.controller.getCategoryById )

        router.put('/:id', [
            ParamsHandlerMiddleware.hasIDItem()
        ], this.controller.updateCategory )

        router.patch('/activate/:id', [
            ParamsHandlerMiddleware.hasIDItem()
        ], this.controller.activateCategory )

        router.patch('/deactivate/:id', [
            ParamsHandlerMiddleware.hasIDItem()
        ], this.controller.deactivateCategory )

        return router
    }
}