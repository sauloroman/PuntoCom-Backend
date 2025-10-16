import { SaleDetail, SaleDetailsResponse, SaveSale } from "../dtos/sale.dto";
import { ReduceStockUseCase } from "../usecases/product/reduce-stock.use-case";
import { SaveSaleUseCase } from "../usecases/sale";
import { SaveDetailSaleUseCase } from "../usecases/sale/save-detail-save.use-case";

interface SaleServiceOptions {
    saveSaleUC: SaveSaleUseCase   
    saveSaleDetailUC: SaveDetailSaleUseCase,
    reduceStockUC: ReduceStockUseCase
}

export class SaleService {

    private readonly saveSaleUC: SaveSaleUseCase
    private readonly saveSaleDetailUC: SaveDetailSaleUseCase
    private readonly reduceStockUC: ReduceStockUseCase

    constructor({
        saveSaleUC,
        saveSaleDetailUC,
        reduceStockUC
    }: SaleServiceOptions){
        this.saveSaleUC = saveSaleUC
        this.saveSaleDetailUC = saveSaleDetailUC
        this.reduceStockUC = reduceStockUC
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