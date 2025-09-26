import { DatesAdapter } from "../../../config/plugins";
import { Category } from "../../../domain/entities";
import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { CategoryResponseDto } from "../../dtos/category.dto";

export class GetAllCategoriesUseCase {

    constructor(public readonly categoryRepository: CategoryRepository){}

    public async execute(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoryRepository.getAllCategories()
        return categories.map( (cat: Category) => {
            return {
                id: cat.id,
                name: cat.name,
                description: cat.description,
                icon: cat.icon,
                isActive: cat.isActive,
                createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal( cat.createdAt ) ),
                updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal( cat.updatedAt ) )
            }
        })
    }

}