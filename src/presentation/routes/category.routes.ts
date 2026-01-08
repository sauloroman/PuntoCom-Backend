import { Router } from "express";
import { CategoryController } from "../controllers";
import { Auth, FileUploadMiddleware, MapperFilterMiddleware, ParamsHandlerMiddleware, ValidateRolesMiddleware } from "../middlewares";
import { RoleEnum } from "../../../generated/prisma";

interface CategoryRoutesI {
    controller: CategoryController,
}

export class CategoryRoutes {

    public readonly routes: Router
    private readonly controller: CategoryController

    constructor({ controller }: CategoryRoutesI){
        this.controller = controller
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([Auth.Logged])

        router.patch('/upload-image/:id', [ 
            ParamsHandlerMiddleware.hasIDItem(),
            FileUploadMiddleware.validateContainFiles 
        ], this.controller.uploadCategoryImage )

        router.get('/all', this.controller.getAllCategories)
        router.get('/', [MapperFilterMiddleware.ToPrisma()], this.controller.getCategories)
        router.get('/search', [MapperFilterMiddleware.ToPrismaContains()], this.controller.getCategories)

        router.use([ ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ) ])

        router.post('/', this.controller.createCategory )
        router.get('/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.getCategoryById )
        router.put('/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.updateCategory )
        router.patch('/activate/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.activateCategory )
        router.patch('/deactivate/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.deactivateCategory )

        return router
    }
}