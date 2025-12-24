import { PurchaseDetailResponse, PurchaseResponse } from "../../application/dtos/purchase.dto";
import { Purchase, PurchaseDetail } from "../entities";

export abstract class PurchaseRepository {
    abstract savePurchase(purchase: Purchase): Promise<PurchaseResponse>
    abstract savePurchaseDetails( purchaseDetail: PurchaseDetail ): Promise<PurchaseDetailResponse>
    
}