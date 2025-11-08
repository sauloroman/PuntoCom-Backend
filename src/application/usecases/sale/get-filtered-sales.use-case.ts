import { SalesRepository } from "../../../domain/repositories/sale.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { SaleDetailsResponse, SaleFilters } from "../../dtos/sale.dto";

export class GetFilteredSalesUseCase {

    constructor(private readonly saleRepository: SalesRepository){}

    public async execute( filter: SaleFilters, pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        if ( !filter.prices && !filter.dates ) {
            return await this.saleRepository.getSales(pagination)
        }

        return await this.saleRepository.getFilteredSales(filter, pagination)
    }

}