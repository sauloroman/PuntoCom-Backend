import { SaleService } from "../application/services"
import { ReduceStockUseCase } from "../application/usecases/product"
import { FilterSalesUseCase, GetSaleByIdUseCase, ListSalesUseCase, SaveDetailSaleUseCase, SaveSaleUseCase } from "../application/usecases/sale"
import { MSSQLProduct } from "../infrastructure/datasource/ms-sql"
import { MSSQLSales } from "../infrastructure/datasource/ms-sql/mssql-sale.datasource"
import { ProductRepositoryImp, SalesRepositoryImpl } from "../infrastructure/repositories"

import { SalesController } from "../presentation/controllers"
import { SaleRoutes } from "../presentation/routes"

export class SaleContainer {

    public readonly saleRoutes: SaleRoutes

    constructor() {

        const saleRepository = new SalesRepositoryImpl( new MSSQLSales() )
        const productRepository = new ProductRepositoryImp( new MSSQLProduct())

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