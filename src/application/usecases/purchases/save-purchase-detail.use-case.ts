import { DatesAdapter } from "../../../config/plugins";
import { PurchaseDetail } from "../../../domain/entities";
import { PurchaseRepository } from "../../../domain/repositories/purchase.repository";
import { Money, Quantity } from "../../../domain/value-objects";
import { PurchaseDetailResponse, SavePurchaseDetail } from "../../dtos/purchase.dto";

export class SavePurchaseDetailUseCase {

    constructor(private readonly purchaseRepository: PurchaseRepository ){}

    public async execute( purchaseId: string, data: SavePurchaseDetail ): Promise<PurchaseDetailResponse> {

        const detail = new PurchaseDetail({
            productId: data.productId,
            purchaseId: purchaseId,
            purchaseQuantity: new Quantity( data.quantity ),
            purchaseUnitPrice: new Money( data.unitPrice ),
            createdAt: DatesAdapter.now(),
            updatedAt: DatesAdapter.now()
        })

        return await this.purchaseRepository.savePurchaseDetails(detail)
    }

}