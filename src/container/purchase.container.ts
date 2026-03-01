import { ConnectionPool } from "mssql"
import { PurchaseService } from "../application/services"
import { IncreaseStockUseCase } from "../application/usecases/product"
import { 
    FilterPurchasesUseCase, 
    ListPurchasesUseCase, 
    SavePurchaseDetailUseCase, 
    SavePurchaseUseCase } from "../application/usecases/purchases"
import { PrismaDatasource, PrismaProductDatasource, PrismaPurchaseDatasource } from "../infrastructure/datasource/prisma"
import { ProductRepositoryImp, PurchaseRepositoryImp } from "../infrastructure/repositories"
import { PurchasesController } from "../presentation/controllers"
import { PurchaseRoutes } from "../presentation/routes"
import { Auth } from "../presentation/middlewares"

const prismaClient = PrismaDatasource.getInstance()

export class PurchaseContainer {

    public readonly purchaseRoutes: PurchaseRoutes

    constructor(private readonly pool: ConnectionPool ) {

        // ---- Repositories
        const purchaseRepository = new PurchaseRepositoryImp(new PrismaPurchaseDatasource( prismaClient ))
        const productRepository = new ProductRepositoryImp(new PrismaProductDatasource( prismaClient ))

        // ---- Use Cases
        const filterPurchasesUC = new FilterPurchasesUseCase( purchaseRepository )
        const getPurchasesUC = new ListPurchasesUseCase( purchaseRepository )
        const savePurchaseUC = new SavePurchaseUseCase( purchaseRepository )
        const savePurchaseDetailUC = new SavePurchaseDetailUseCase( purchaseRepository )
        const increaseStockUC = new IncreaseStockUseCase( productRepository )

        // ---- Service
        const purchaseService = new PurchaseService({
            filterPurchasesUC: filterPurchasesUC,
            getPurchasesUC: getPurchasesUC,
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