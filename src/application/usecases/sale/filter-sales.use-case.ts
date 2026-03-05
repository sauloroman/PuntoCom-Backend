import { SalesRepository } from "../../../domain/repositories";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { SaleDetailsResponse, FilterSale } from "../../dtos/sale.dto";

export class FilterSalesUseCase {

    constructor(private readonly salesRepository: SalesRepository){}

    public async execute( pagination: PaginationDTO, filter: FilterSale ): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        return await this.salesRepository.filterSales(pagination, filter)
    }

}