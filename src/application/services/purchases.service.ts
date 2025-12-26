import { PaginationDTO } from "../dtos/pagination.dto";
import { PurchaseDetailsReponse, PurchaseFilters, SavePurchase, SavePurchaseDetail } from "../dtos/purchase.dto";
import { IncreaseStockUseCase } from "../usecases/product";
import { ListPurchasesUseCase, SavePurchaseDetailUseCase, SavePurchaseUseCase } from "../usecases/purchases";
import { FilterPurchasesUseCase } from "../usecases/purchases/filter-purchases.use-case";

interface PurchaseServiceOptions {
    filterPurchasesUC: FilterPurchasesUseCase,
    getPurchasesUC: ListPurchasesUseCase,
    savePurchaseUC: SavePurchaseUseCase,
    savePurchaseDetailUC: SavePurchaseDetailUseCase,
    increaseStockUC: IncreaseStockUseCase
}

export class PurchaseService {
    
    private readonly filterPurchasesUC: FilterPurchasesUseCase
    private readonly getPurchasesUC: ListPurchasesUseCase
    private readonly savePurchaseUC: SavePurchaseUseCase 
    private readonly savePurchaseDetailUC: SavePurchaseDetailUseCase 
    private readonly increaseStockUC: IncreaseStockUseCase

    constructor({
        filterPurchasesUC,
        getPurchasesUC,
        savePurchaseUC,
        savePurchaseDetailUC,
        increaseStockUC
    }: PurchaseServiceOptions){
        this.filterPurchasesUC = filterPurchasesUC
        this.getPurchasesUC = getPurchasesUC
        this.savePurchaseUC = savePurchaseUC
        this.savePurchaseDetailUC = savePurchaseDetailUC
        this.increaseStockUC = increaseStockUC
    }

    async listPurchases( pagination: PaginationDTO ) {
        return await this.getPurchasesUC.execute(pagination)
    }

    async filterPurchases( filter: PurchaseFilters, pagination: PaginationDTO ) {
        return await this.filterPurchasesUC.execute(filter, pagination)
    }

    async savePurchase( savePurchaseDto: SavePurchase, details: SavePurchaseDetail[] ): Promise<PurchaseDetailsReponse> {
        for ( const detail of details ) {
            await this.increaseStockUC.validate(detail.productId)
        }
        
        const purchase = await this.savePurchaseUC.execute(savePurchaseDto)

        const purchaseDetails = await Promise.all( details.map( async ( detail ) => {
            const purchaseDetail = await this.savePurchaseDetailUC.execute(purchase.purchaseId, {
                productId: detail.productId,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice
            })
            await this.increaseStockUC.execute(detail)
            return purchaseDetail
        }))

        return {
            purchase,
            details: purchaseDetails
        }
    }

}