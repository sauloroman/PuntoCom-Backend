import { PaginationDTO } from "../dtos/pagination.dto";
import { PurchaseDetailsResponse, FilterPurchase, SavePurchase, SavePurchaseDetail } from "../dtos/purchase.dto";
import { IncreaseStockUseCase } from "../usecases/product";
import { GetPurchaseByIdUseCase, SavePurchaseDetailUseCase, SavePurchaseUseCase } from "../usecases/purchases";
import { FilterPurchasesUseCase } from "../usecases/purchases/filter-purchases.use-case";

interface PurchaseServiceOptions {
    filterPurchasesUC: FilterPurchasesUseCase,
    getPurchaseByIdUC: GetPurchaseByIdUseCase,
    savePurchaseUC: SavePurchaseUseCase,
    savePurchaseDetailUC: SavePurchaseDetailUseCase,
    increaseStockUC: IncreaseStockUseCase
}

export class PurchaseService {
    
    private readonly filterPurchasesUC: FilterPurchasesUseCase
    private readonly getPurchaseByIdUC: GetPurchaseByIdUseCase
    private readonly savePurchaseUC: SavePurchaseUseCase 
    private readonly savePurchaseDetailUC: SavePurchaseDetailUseCase 
    private readonly increaseStockUC: IncreaseStockUseCase

    constructor({
        filterPurchasesUC,
        getPurchaseByIdUC,
        savePurchaseUC,
        savePurchaseDetailUC,
        increaseStockUC
    }: PurchaseServiceOptions){
        this.filterPurchasesUC = filterPurchasesUC
        this.getPurchaseByIdUC = getPurchaseByIdUC
        this.savePurchaseUC = savePurchaseUC
        this.savePurchaseDetailUC = savePurchaseDetailUC
        this.increaseStockUC = increaseStockUC
    }

    async getPurchaseById(saleId: string) {
        return await this.getPurchaseByIdUC.execute(saleId)
    }

    async filterPurchases( filter: FilterPurchase, pagination: PaginationDTO ) {
        return await this.filterPurchasesUC.execute(filter, pagination)
    }

    async savePurchase( savePurchaseDto: SavePurchase, details: SavePurchaseDetail[] ): Promise<PurchaseDetailsResponse> {
        for ( const detail of details ) {
            await this.increaseStockUC.validate(detail.productId)
        }
        
        const purchase = await this.savePurchaseUC.execute(savePurchaseDto)

        const purchaseDetails = await Promise.all( details.map( async ( detail ) => {
            const purchaseDetail = await this.savePurchaseDetailUC.execute(purchase.purchaseId, detail)
            await this.increaseStockUC.execute(detail)
            return purchaseDetail
        }))

        return {
            purchase,
            details: purchaseDetails
        }
    }

}