import { ProductRepository } from "../../../domain/repositories";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { FilterProducts, ProductResponseIncludeDto } from "../../dtos/product.dto";

export class ListProductsUseCase {

    constructor(private readonly productRepository: ProductRepository){}

    public async execute( pagination: PaginationDTO, filter: FilterProducts ): Promise<PaginationResponseDto<ProductResponseIncludeDto>> {
        const { items, page, total, totalPages } = await this.productRepository.filterProducts( pagination, filter )

        return {
            items,
            page,
            total,
            totalPages
        }

    }

}