import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { PurchaseDetailResponse, PurchaseDetailsReponse, PurchaseResponse } from "../../application/dtos/purchase.dto";
import { Purchase, PurchaseDetail } from "../entities";

export abstract class PurchaseRepository {
    abstract savePurchase(purchase: Purchase): Promise<PurchaseResponse>
    abstract savePurchaseDetails( purchaseDetail: PurchaseDetail ): Promise<PurchaseDetailResponse>
    abstract getPurchases( pagination: PaginationDTO ): Promise<PaginationResponseDto<PurchaseDetailsReponse>>
    
}