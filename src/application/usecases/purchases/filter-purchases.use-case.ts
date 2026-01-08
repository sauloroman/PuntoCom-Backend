import { PurchaseRepository } from "../../../domain/repositories/purchase.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { PurchaseDetailsResponse, PurchaseFilters } from "../../dtos/purchase.dto";

export class FilterPurchasesUseCase {

    constructor(private readonly purchaseRepository: PurchaseRepository ){}

    public async execute( filter: PurchaseFilters, pagination: PaginationDTO ): Promise<PaginationResponseDto<PurchaseDetailsResponse>> {
        if ( !filter.prices && !filter.dates && !filter.supplier && !filter.user ) {
            return await this.purchaseRepository.getPurchases(pagination)
        }

        return await this.purchaseRepository.filterPurchases(filter, pagination)
    }

}