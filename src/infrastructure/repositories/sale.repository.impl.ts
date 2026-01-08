import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { SaleDetailsResponse, SaleFilters, SaleProductDetailResponse, SaleResponse } from "../../application/dtos/sale.dto";
import { Sale, SaleProductDetail } from "../../domain/entities";
import { SalesRepository } from "../../domain/repositories/sale.repository";

export class SalesRepositoryImpl implements SalesRepository {
    
    constructor(private readonly salesRepository: SalesRepository){}
    
    async filterSales(filter: SaleFilters, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        return await this.salesRepository.filterSales( filter, pagination )
    }
    
    async getSales(pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        return await this.salesRepository.getSales( pagination )
    }
    
    async saveSaleDetails(data: SaleProductDetail): Promise<SaleProductDetailResponse> {
        return await this.salesRepository.saveSaleDetails(data)
    }

    async findById(id: string): Promise<SaleDetailsResponse | null> {
        return await this.salesRepository.findById(id)
    }

    async saveSale(data: Sale): Promise<SaleResponse> {
        return await this.salesRepository.saveSale(data)
    }

}