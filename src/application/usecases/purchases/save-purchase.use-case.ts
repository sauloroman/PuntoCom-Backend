import { DatesAdapter } from "../../../config/plugins";
import { Purchase } from "../../../domain/entities";
import { PurchaseRepository } from "../../../domain/repositories";
import { Money } from "../../../domain/value-objects";
import { PurchaseResponse, SavePurchase } from "../../dtos/purchase.dto";
import { ApplicationError } from "../../errors/application.error";

export class SavePurchaseUseCase {

    private MESSAGE_ERROR = 'PURCHASE_NOT_CREATED'

    constructor(public readonly purchaseRepository: PurchaseRepository ){}

    public async execute( purchaseData: SavePurchase ): Promise<PurchaseResponse> {
        const newPurchase = new Purchase({
            total: new Money(purchaseData.total),
            date: DatesAdapter.now(),
            supplierId: purchaseData.supplierId,
            userId: purchaseData.userId,
            createdAt: DatesAdapter.now()
        })

        const purchase = await this.purchaseRepository.savePurchase(newPurchase)
        if ( !purchase ) throw new ApplicationError('No se pudo crear la compra', this.MESSAGE_ERROR)
        return purchase
    }

}