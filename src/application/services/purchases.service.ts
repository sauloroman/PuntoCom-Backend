import { PaginationDTO } from "../dtos/pagination.dto";
import { PurchaseDetailsReponse, SavePurchase, SavePurchaseDetail } from "../dtos/purchase.dto";
import { IncreaseStockUseCase } from "../usecases/product";
import { ListPurchasesUseCase, SavePurchaseDetailUseCase, SavePurchaseUseCase } from "../usecases/purchases";

interface PurchaseServiceOptions {
    getPurchasesUC: ListPurchasesUseCase,
    savePurchaseUC: SavePurchaseUseCase,
    savePurchaseDetailUC: SavePurchaseDetailUseCase,
    increaseStockUC: IncreaseStockUseCase
}

export class PurchaseService {
 
    private readonly getPurchasesUC: ListPurchasesUseCase
    private readonly savePurchaseUC: SavePurchaseUseCase 
    private readonly savePurchaseDetailUC: SavePurchaseDetailUseCase 
    private readonly increaseStockUC: IncreaseStockUseCase

    constructor({
        getPurchasesUC,
        savePurchaseUC,
        savePurchaseDetailUC,
        increaseStockUC
    }: PurchaseServiceOptions){
        this.getPurchasesUC = getPurchasesUC
        this.savePurchaseUC = savePurchaseUC
        this.savePurchaseDetailUC = savePurchaseDetailUC
        this.increaseStockUC = increaseStockUC
    }

    async listSales( pagination: PaginationDTO ) {
        return await this.getPurchasesUC.execute(pagination)
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