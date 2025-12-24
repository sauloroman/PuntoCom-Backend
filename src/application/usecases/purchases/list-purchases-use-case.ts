import { PurchaseRepository } from "../../../domain/repositories/purchase.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { PurchaseDetailsReponse } from "../../dtos/purchase.dto";

export class ListPurchasesUseCase {

    constructor(private readonly purchaseRepository: PurchaseRepository){}

    public async execute( pagination: PaginationDTO ): Promise<PaginationResponseDto<PurchaseDetailsReponse>> {
        const { items, page, total, totalPages } = await this.purchaseRepository.getPurchases( pagination )
        return {
            items,
            page,
            total,
            totalPages
        }
    }

}