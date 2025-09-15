import { ProductRepository } from "../../../domain/repositories/product.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { ProductResponseIncludeDto } from "../../dtos/product.dto";

export class ListProductsUseCase {

    constructor(private readonly productRepository: ProductRepository){}

    public async execute( pagination: PaginationDTO ): Promise<PaginationResponseDto<ProductResponseIncludeDto>> {
        const { items, page, total, totalPages } = await this.productRepository.getProducts( pagination )

        return {
            items,
            page,
            total,
            totalPages
        }

    }

}