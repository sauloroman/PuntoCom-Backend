import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { SaleDetailsResponse, SaleFilters, SaleProductDetailResponse, SaleResponse } from "../../application/dtos/sale.dto";
import { Sale, SaleProductDetail } from "../../domain/entities";
import { SalesRepository } from "../../domain/repositories/sale.repository";

export class SalesRepositoryImpl implements SalesRepository {
    
    constructor(private readonly salesRepository: SalesRepository){}
    
    async findByUser(userId: string, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        return await this.salesRepository.findByUser(userId, pagination)
    }
    
    async getFilteredSales(filter: SaleFilters, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        return await this.salesRepository.getFilteredSales( filter, pagination )
    }
    
    async getFilteredSalesByUser(userId: string, filter: SaleFilters, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        return await this.salesRepository.getFilteredSalesByUser(userId, filter, pagination)
    }
    
    async getSales(pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        return await this.salesRepository.getSales( pagination )
    }
    
    async saveSaleDetails(data: SaleProductDetail): Promise<SaleProductDetailResponse> {
        return await this.salesRepository.saveSaleDetails(data)
    }

    async findById(id: string): Promise<SaleResponse | null> {
        return await this.salesRepository.findById(id)
    }

    async saveSale(data: Sale): Promise<SaleResponse> {
        return await this.salesRepository.saveSale(data)
    }

}