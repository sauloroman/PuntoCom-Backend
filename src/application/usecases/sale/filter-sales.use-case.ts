import { SalesRepository } from "../../../domain/repositories/sale.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { SaleDetailsResponse, SaleFilters } from "../../dtos/sale.dto";

export class FilterSalesUseCase {

    constructor(private readonly salesRepository: SalesRepository){}

    public async execute( filter: SaleFilters, pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        if ( !filter.prices && !filter.dates && !filter.user ) {
            return await this.salesRepository.getSales(pagination)
        }

        return await this.salesRepository.filterSales(filter, pagination)
    }

}