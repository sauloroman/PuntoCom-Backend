import { PaginationDTO } from "../dtos/pagination.dto";
import { SaleDetail, SaleDetailsResponse, SaleFilters, SaveSale } from "../dtos/sale.dto";
import { ReduceStockUseCase } from "../usecases/product";
import {  FilterSalesUseCase, GetSaleByIdUseCase, ListSalesUseCase, SaveDetailSaleUseCase, SaveSaleUseCase } from "../usecases/sale";

interface SaleServiceOptions {
    saveSaleUC: SaveSaleUseCase   
    saveSaleDetailUC: SaveDetailSaleUseCase,
    reduceStockUC: ReduceStockUseCase
    listSalesUC: ListSalesUseCase,
    filterSalesUC: FilterSalesUseCase
    getSaleByIdUC: GetSaleByIdUseCase
}

export class SaleService {

    private readonly saveSaleUC: SaveSaleUseCase
    private readonly saveSaleDetailUC: SaveDetailSaleUseCase
    private readonly reduceStockUC: ReduceStockUseCase
    private readonly listSalesUC: ListSalesUseCase
    private readonly filterSalesUC: FilterSalesUseCase
    private readonly getSaleByIdUC: GetSaleByIdUseCase

    constructor({
        saveSaleUC,
        saveSaleDetailUC,
        reduceStockUC,
        listSalesUC,
        filterSalesUC,
        getSaleByIdUC
    }: SaleServiceOptions){
        this.saveSaleUC = saveSaleUC
        this.saveSaleDetailUC = saveSaleDetailUC
        this.reduceStockUC = reduceStockUC
        this.listSalesUC = listSalesUC
        this.filterSalesUC = filterSalesUC
        this.getSaleByIdUC = getSaleByIdUC
    }

    async filterSales( filter: SaleFilters, pagination: PaginationDTO ) {
        return await this.filterSalesUC.execute(filter, pagination)
    }

    async getSaleById( saleId: string ) {
        return await this.getSaleByIdUC.execute(saleId)
    }

    async listSales( pagination: PaginationDTO ) {
        return await this.listSalesUC.execute( pagination )
    }

    async saveSale( dto: SaveSale, details: SaleDetail[] ): Promise<SaleDetailsResponse> {
        
        for( const detail of details ) {
            await this.reduceStockUC.validate(detail.productId, detail.quantity)
        }

        const sale = await this.saveSaleUC.execute(dto)

        const saleDetails = await Promise.all( details.map( async (detail) => {
            const saleDetail = await this.saveSaleDetailUC.execute( sale.saleId, detail )
            await this.reduceStockUC.execute(detail)
            return saleDetail
        }))

        return {
            sale,
            details: saleDetails
        }
    }


}   