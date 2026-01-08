import { Router } from "express";
import { ReportController } from "../controllers";
import { Auth, ValidateEntityReportMiddleware, ValidateRolesMiddleware } from "../middlewares";
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

        router.use([Auth.Logged, ValidateRolesMiddleware.hasRole(RoleEnum.Administrador)])

        router.get('/list/:entity', [ ValidateEntityReportMiddleware.validate() ], this.controller.createListPdfReport )
        router.get('/:entity/:id', [ ValidateEntityReportMiddleware.validate() ], this.controller.getReport )
        router.get('/all', this.controller.getAllReports)
        router.delete('/:entity/:id', [ ValidateEntityReportMiddleware.validate() ], this.controller.deleteReport)

        return router
    }

}