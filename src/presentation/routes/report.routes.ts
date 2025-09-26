import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { Auth } from "../middlewares/auth";
import { AuthMiddleware, ValidateEntityReportMiddleware, ValidateRolesMiddleware } from "../middlewares";
import { RoleEnum } from "../../../generated/prisma";

interface ReportRoutesI {
    controller: ReportController
}

export class ReportRoutes {

    public readonly routes: Router
    private readonly controller: ReportController

    constructor({ controller }: ReportRoutesI) {
        this.controller = controller
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()

        router.use([Auth.Logged])

        router.get('/list/:entity', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador),
            ValidateEntityReportMiddleware.validate()
        ], this.controller.createListPdfReport )
        
        router.get('/:entity/:id', [
            ValidateRolesMiddleware.hasRole(RoleEnum.Administrador),
            ValidateEntityReportMiddleware.validate()
        ], this.controller.getReport )

        return router
    }

}