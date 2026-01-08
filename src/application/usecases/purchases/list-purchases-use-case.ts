import { PurchaseRepository } from "../../../domain/repositories/purchase.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { PurchaseDetailsResponse } from "../../dtos/purchase.dto";

export class ListPurchasesUseCase {

    constructor(private readonly purchaseRepository: PurchaseRepository){}

    public async execute( pagination: PaginationDTO ): Promise<PaginationResponseDto<PurchaseDetailsResponse>> {
        const { items, page, total, totalPages } = await this.purchaseRepository.getPurchases( pagination )
        return {
            items,
            page,
            total,
            totalPages
        }
    }

}