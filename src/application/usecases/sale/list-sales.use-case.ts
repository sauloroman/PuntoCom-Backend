import { SalesRepository } from "../../../domain/repositories/sale.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { SaleDetailsResponse } from "../../dtos/sale.dto";

export class ListSalesUseCase {

    constructor(private readonly salesRepository: SalesRepository){}

    public async execute( pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        const { items, page, total, totalPages } = await this.salesRepository.getSales( pagination )
        return {
            items,
            page,
            total,
            totalPages
        }
    }

}