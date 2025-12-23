import { PaginationDTO } from "../dtos/pagination.dto";
import { SaleDetail, SaleDetailsResponse, SaleFilters, SaveSale } from "../dtos/sale.dto";
import { ReduceStockUseCase } from "../usecases/product/reduce-stock.use-case";
import { 
    GetFilteredSalesByUserUseCase, 
    GetFilteredSalesUseCase, 
    GetSaleByIdUseCase, 
    GetSalesByUserUseCase, 
    ListSalesUseCase, 
    SaveDetailSaleUseCase, 
    SaveSaleUseCase 
} from "../usecases/sale";

interface SaleServiceOptions {
    saveSaleUC: SaveSaleUseCase   
    saveSaleDetailUC: SaveDetailSaleUseCase,
    reduceStockUC: ReduceStockUseCase
    listSalesUC: ListSalesUseCase
    getSalesByUserUC: GetSalesByUserUseCase,
    getFilteredSalesUC: GetFilteredSalesUseCase,
    getFilteredSalesByUserUC: GetFilteredSalesByUserUseCase
    getSaleByIdUC: GetSaleByIdUseCase
}

export class SaleService {

    private readonly saveSaleUC: SaveSaleUseCase
    private readonly saveSaleDetailUC: SaveDetailSaleUseCase
    private readonly reduceStockUC: ReduceStockUseCase
    private readonly listSalesUC: ListSalesUseCase
    private readonly getSalesByUserUC: GetSalesByUserUseCase
    private readonly getFilteredSalesUC: GetFilteredSalesUseCase
    private readonly getFilteredSalesByUserUC: GetFilteredSalesByUserUseCase
    private readonly getSaleByIdUC: GetSaleByIdUseCase

    constructor({
        saveSaleUC,
        saveSaleDetailUC,
        reduceStockUC,
        listSalesUC,
        getSalesByUserUC,
        getFilteredSalesUC,
        getFilteredSalesByUserUC,
        getSaleByIdUC
    }: SaleServiceOptions){
        this.saveSaleUC = saveSaleUC
        this.saveSaleDetailUC = saveSaleDetailUC
        this.reduceStockUC = reduceStockUC
        this.listSalesUC = listSalesUC
        this.getSalesByUserUC = getSalesByUserUC
        this.getFilteredSalesUC = getFilteredSalesUC
        this.getFilteredSalesByUserUC = getFilteredSalesByUserUC
        this.getSaleByIdUC = getSaleByIdUC
    }

    async getSalesByUser( userId: string, pagination: PaginationDTO ) {
        return await this.getSalesByUserUC.execute(userId, pagination)
    }

    async getFilteredSales( filter: SaleFilters, pagination: PaginationDTO ) {
        return await this.getFilteredSalesUC.execute(filter, pagination)
    }
    
    async getFilteredSalesByUser( userId: string, filter: SaleFilters, pagination: PaginationDTO ) {
        return await this.getFilteredSalesByUserUC.execute(userId, filter, pagination)
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
            const saleDetail = await this.saveSaleDetailUC.execute( sale.id, detail )
            await this.reduceStockUC.execute(detail)
            return saleDetail
        }))

        return {
            ...sale,
            details: saleDetails
        }
    }


}   