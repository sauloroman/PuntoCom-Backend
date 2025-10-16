import { Router } from "express";
import { SalesController } from "../controllers/sales.controller";
import { Auth } from "../middlewares/auth";

interface SaleRoutesI {
    controller: SalesController
}

export class SaleRoutes {
    public readonly routes: Router
    private readonly controller: SalesController

    constructor({ controller }: SaleRoutesI) {
        this.controller = controller
        this.routes = this.initRoutes()
    }

    private initRoutes(): Router {
        const router = Router()
        router.use([Auth.Logged])

        router.post('/', this.controller.saveSale )

        return router;  
    }

}