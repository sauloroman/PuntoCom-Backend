import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { SaleDetailsResponse, SaleProductDetailResponse, SaleResponse } from "../../application/dtos/sale.dto";
import { Sale, SaleProductDetail } from "../entities";

export abstract class SalesRepository {
    abstract saveSale( data: Sale ): Promise<SaleResponse>
    abstract saveSaleDetails( data: SaleProductDetail ): Promise<SaleProductDetailResponse>
    abstract findById( id: string ): Promise<SaleResponse | null> 
    abstract findByUser(userId: string, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>>
    abstract getSales( pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>>
}