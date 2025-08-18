import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { Auth } from "../middlewares/auth";
import { ParamsHandlerMiddleware, ValidateRolesMiddleware } from "../middlewares";
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

        router.use([ Auth.Logged,  ValidateRolesMiddleware.hasRole( RoleEnum.Administrador ) ])

        router.post('/', this.controller.createCategory )
        router.get('/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.getCategoryById )
        router.put('/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.updateCategory )
        router.patch('/activate/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.activateCategory )
        router.patch('/deactivate/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.deactivateCategory )

        return router
    }
}