import { PurchaseRepository } from "../../../domain/repositories";
import { PurchaseDetailsResponse } from "../../dtos/purchase.dto";
import { ApplicationError } from "../../errors";

export class GetPurchaseByIdUseCase {
    
    private MESSAGE_ERROR = 'PURCHASE_NOT_FOUND'

    constructor(private readonly purchaseRepository: PurchaseRepository){}

    public async execute( purchaseId: string ): Promise<PurchaseDetailsResponse> {
        if ( !purchaseId ) throw new ApplicationError('El id de la compra es obligatoria')
        
        const purchase = await this.purchaseRepository.findByID(purchaseId)

        if ( !purchase ) throw new ApplicationError(`La compra con id ${purchaseId} no existe`, this.MESSAGE_ERROR)

        return purchase
    }

}