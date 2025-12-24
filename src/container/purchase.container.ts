import { PurchaseService } from "../application/services";
import { IncreaseStockUseCase } from "../application/usecases/product";
import { ListPurchasesUseCase, SavePurchaseDetailUseCase, SavePurchaseUseCase } from "../application/usecases/purchases";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaProductDatasource } from "../infrastructure/datasource/prisma/prisma-product.datasource";
import { PrismaPurchaseDatasource } from "../infrastructure/datasource/prisma/prisma-purchase.datasource";
import { ProductRepositoryImp } from "../infrastructure/repositories/product.repository.impl";
import { PurchaseRepositoryImp } from "../infrastructure/repositories/purchase.repository.impl";
import { PurchasesController } from "../presentation/controllers/purchases.controller";
import { PurchaseRoutes } from "../presentation/routes";

const prismaClient = PrismaDatasource.getInstance()

export class PurchaseContainer {

    public readonly purchaseRoutes: PurchaseRoutes

    constructor() {

        const purchaseRepository = new PurchaseRepositoryImp(
            new PrismaPurchaseDatasource( prismaClient )
        )

        const productRepository = new ProductRepositoryImp(
            new PrismaProductDatasource( prismaClient )
        )

        const getPurchasesUC = new ListPurchasesUseCase( purchaseRepository )
        const savePurchaseUC = new SavePurchaseUseCase( purchaseRepository )
        const savePurchaseDetailUC = new SavePurchaseDetailUseCase( purchaseRepository )
        const increaseStockUC = new IncreaseStockUseCase( productRepository )

        const purchaseService = new PurchaseService({
            getPurchasesUC: getPurchasesUC,
            savePurchaseUC: savePurchaseUC,
            savePurchaseDetailUC: savePurchaseDetailUC,
            increaseStockUC: increaseStockUC
        })

        const purchaseController = new PurchasesController(purchaseService)

        this.purchaseRoutes = new PurchaseRoutes({
            controller: purchaseController
        })
    }

}