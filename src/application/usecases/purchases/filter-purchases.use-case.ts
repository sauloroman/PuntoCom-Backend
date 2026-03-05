import { PurchaseRepository } from "../../../domain/repositories";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { PurchaseDetailsResponse, FilterPurchase } from "../../dtos/purchase.dto";

export class FilterPurchasesUseCase {

    constructor(private readonly purchaseRepository: PurchaseRepository ){}

    public async execute( filter: FilterPurchase, pagination: PaginationDTO ): Promise<PaginationResponseDto<PurchaseDetailsResponse>> {
        return await this.purchaseRepository.filterPurchases(pagination, filter)
    }

}