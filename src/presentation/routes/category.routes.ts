import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { Auth } from "../middlewares/auth";
import { ValidateRolesMiddleware } from "../middlewares";
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

        router.use([ Auth.Logged ])

        router.post('/', [
            ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
        ], this.controller.createCategory )

        return router
    }
}