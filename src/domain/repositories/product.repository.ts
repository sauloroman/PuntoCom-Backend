import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { ProductInfo, ProductResponseIncludeDto, StockCriteria } from "../../application/dtos/product.dto";
import { Product } from "../entities";

export abstract class ProductRepository {
    abstract findById( productId: string ): Promise<ProductResponseIncludeDto | null> 
    abstract findByName( productName: string ): Promise<ProductResponseIncludeDto | null>
    abstract create( product: Product ): Promise<ProductResponseIncludeDto>
    abstract update( product: Product ): Promise<ProductResponseIncludeDto>
    abstract changeStatus( productId: string, status: boolean ): Promise<ProductResponseIncludeDto>
    abstract getAllProducts(): Promise<ProductResponseIncludeDto[]>
    abstract getProducts( pagination: PaginationDTO ): Promise<PaginationResponseDto<ProductResponseIncludeDto>> 
    abstract getMinimalInformationProducts(): Promise<ProductInfo[]>
    abstract getProductsByStock( stockCriteria: StockCriteria ): Promise<ProductResponseIncludeDto[]>
}