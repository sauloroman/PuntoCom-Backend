import { ConnectionPool } from "mssql"
import { PurchaseService } from "../application/services"
import { IncreaseStockUseCase } from "../application/usecases/product"
import { 
    FilterPurchasesUseCase, 
    GetPurchaseByIdUseCase, 
    SavePurchaseDetailUseCase, 
    SavePurchaseUseCase } from "../application/usecases/purchases"
import { PurchasesController } from "../presentation/controllers"
import { PurchaseRoutes } from "../presentation/routes"
import { Auth } from "../presentation/middlewares"
import { MSSQLPurchases } from "../infrastructure/datasource/ms-sql/datasources/mssql-purchase.datasource"
import { MSSQLProduct } from "../infrastructure/datasource/ms-sql/datasources"

export class PurchaseContainer {

    public readonly purchaseRoutes: PurchaseRoutes

    constructor(private readonly pool: ConnectionPool ) {

        // ---- Repositories
        const purchaseRepository = new MSSQLPurchases(this.pool)
        const productRepository = new MSSQLProduct(this.pool)

        // ---- Use Cases
        const getPurchaseByIdUC = new GetPurchaseByIdUseCase(purchaseRepository)
        const filterPurchasesUC = new FilterPurchasesUseCase( purchaseRepository )
        const savePurchaseUC = new SavePurchaseUseCase( purchaseRepository )
        const savePurchaseDetailUC = new SavePurchaseDetailUseCase( purchaseRepository )
        const increaseStockUC = new IncreaseStockUseCase( productRepository )

        // ---- Service
        const purchaseService = new PurchaseService({
            filterPurchasesUC: filterPurchasesUC,
            getPurchaseByIdUC: getPurchaseByIdUC,
            savePurchaseUC: savePurchaseUC,
            savePurchaseDetailUC: savePurchaseDetailUC,
            increaseStockUC: increaseStockUC
        })

        // ---- Controller
        const purchaseController = new PurchasesController(purchaseService)

        const auth = new Auth( this.pool )

        this.purchaseRoutes = new PurchaseRoutes({ 
            controller: purchaseController,
            auth: auth 
        })
    }

}