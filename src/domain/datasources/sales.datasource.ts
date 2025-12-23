import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { SaleDetailsResponse, SaleFilters, SaleProductDetailResponse, SaleResponse } from "../../application/dtos/sale.dto";
import { Sale, SaleProductDetail } from "../entities";

export abstract class SalesDatasource {
    abstract saveSale( data: Sale ): Promise<SaleResponse>
    abstract saveSaleDetails( data: SaleProductDetail ): Promise<SaleProductDetailResponse>
    abstract findById( id: string ): Promise<SaleDetailsResponse | null> 
    abstract findByUser(userId: string, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>>
    abstract getSales( pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>>
    
    abstract getFilteredSales( filter: SaleFilters, pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>>
    abstract getFilteredSalesByUser( userId: string, filter: SaleFilters, pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>>
}