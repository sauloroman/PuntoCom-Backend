import { SaleService } from "../application/services/sale.service";
import { ReduceStockUseCase } from "../application/usecases/product/reduce-stock.use-case";
import { SaveSaleUseCase } from "../application/usecases/sale";
import { SaveDetailSaleUseCase } from "../application/usecases/sale/save-detail-save.use-case";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaProductDatasource } from "../infrastructure/datasource/prisma/prisma-product.datasource";
import { PrismaSalesDatasource } from "../infrastructure/datasource/prisma/prisma-sale.datasource";
import { ProductRepositoryImp } from "../infrastructure/repositories/product.repository.impl";
import { SalesRepositoryImpl } from "../infrastructure/repositories/sale.repository.impl";
import { SalesController } from "../presentation/controllers/sales.controller";
import { SaleRoutes } from "../presentation/routes";

const prismaClient = PrismaDatasource.getInstance()

export class SaleContainer {

    public readonly saleRoutes: SaleRoutes

    constructor() {

        const saleRepository = new SalesRepositoryImpl( 
            new PrismaSalesDatasource( prismaClient )
        )

        const productRepository = new ProductRepositoryImp(
            new PrismaProductDatasource( prismaClient )
        )

        const saveSaleUC = new SaveSaleUseCase( saleRepository )
        const saveSaleDetailUC = new SaveDetailSaleUseCase( saleRepository )
        const reduceStockUC = new ReduceStockUseCase( productRepository )

        const saleService = new SaleService({
            saveSaleUC: saveSaleUC,
            saveSaleDetailUC: saveSaleDetailUC,
            reduceStockUC: reduceStockUC
        })

        const saleController = new SalesController( saleService )

        this.saleRoutes = new SaleRoutes({
            controller: saleController
        })

    }

}