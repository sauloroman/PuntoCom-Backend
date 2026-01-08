import { SaleService } from "../application/services"
import { ReduceStockUseCase } from "../application/usecases/product"
import { FilterSalesUseCase, GetSaleByIdUseCase, ListSalesUseCase, SaveDetailSaleUseCase, SaveSaleUseCase } from "../application/usecases/sale"

import { PrismaDatasource, PrismaProductDatasource, PrismaSalesDatasource, PrismaUserDatasource } from "../infrastructure/datasource/prisma"
import { ProductRepositoryImp, SalesRepositoryImpl, UserRepositoryImpl } from "../infrastructure/repositories"

import { SalesController } from "../presentation/controllers"
import { SaleRoutes } from "../presentation/routes"

const prismaClient = PrismaDatasource.getInstance()

export class SaleContainer {

    public readonly saleRoutes: SaleRoutes

    constructor() {

        const saleRepository = new SalesRepositoryImpl( 
            new PrismaSalesDatasource( prismaClient )
        )

        const userRepository = new UserRepositoryImpl(
            new PrismaUserDatasource( prismaClient )
        )

        const productRepository = new ProductRepositoryImp(
            new PrismaProductDatasource( prismaClient )
        )

        const saveSaleUC = new SaveSaleUseCase( saleRepository )
        const saveSaleDetailUC = new SaveDetailSaleUseCase( saleRepository )
        const listSalesUC = new ListSalesUseCase( saleRepository )
        const reduceStockUC = new ReduceStockUseCase( productRepository )
        const getSaleByIdUC = new GetSaleByIdUseCase(saleRepository)
        const filterSalesUC = new FilterSalesUseCase(saleRepository)

        const saleService = new SaleService({
            saveSaleUC: saveSaleUC,
            saveSaleDetailUC: saveSaleDetailUC,
            reduceStockUC: reduceStockUC,
            listSalesUC: listSalesUC,
            filterSalesUC: filterSalesUC,
            getSaleByIdUC: getSaleByIdUC
        })

        const saleController = new SalesController( saleService )

        this.saleRoutes = new SaleRoutes({
            controller: saleController
        })

    }

}