import { DatesAdapter } from "../../../config/plugins";
import { Category } from "../../../domain/entities";
import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { CategoryResponseDto } from "../../dtos/category.dto";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";

export class ListCategoriesUseCase {

    constructor(private readonly categoryRepository: CategoryRepository){}

    public async execute( pagination: PaginationDTO ): Promise<PaginationResponseDto<CategoryResponseDto>> {

        const { items, page, total, totalPages } = await this.categoryRepository.getCategories( pagination )

        const categories = items.map((category: Category): CategoryResponseDto => {
            return {
                id: category.id,
                name: category.name,
                description: category.description,
                icon: category.icon,
                isActive: category.isActive,
                createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(category.createdAt)),
                updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(category.updatedAt))
            }
        })

        return {
            items: categories, 
            page: page,
            total: total,
            totalPages: totalPages
        }

    }

}