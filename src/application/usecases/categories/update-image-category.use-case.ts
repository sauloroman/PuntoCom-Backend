import { DatesAdapter } from "../../../config/plugins";
import { Category } from "../../../domain/entities";
import { CategoryRepository } from "../../../domain/repositories";
import { CategoryResponseDto, UpdateCategoryImageDto } from "../../dtos/category.dto";

export class UpdateImageCategoryUseCase {

    constructor(private readonly categoryRepository: CategoryRepository){}

    public async execute( data: UpdateCategoryImageDto ): Promise<CategoryResponseDto | null> {

        const { id, url } = data

        const existingCategory = await this.categoryRepository.findById( id )
        if ( !existingCategory ) return null

        const category = new Category({
            id: existingCategory.id,
            name: existingCategory.name,
            description: existingCategory.description,
            icon: url,
            isActive: existingCategory.isActive,
            createdAt: DatesAdapter.toLocal( existingCategory.createdAt ),
            updatedAt: DatesAdapter.toLocal(DatesAdapter.now())
        })

        const updatedCategory = await this.categoryRepository.update(category)

        return {
            id: updatedCategory.id,
            name: updatedCategory.name,
            description: updatedCategory.description,
            icon: updatedCategory.icon,
            isActive: updatedCategory.isActive,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(updatedCategory.createdAt) ),
            updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(updatedCategory.updatedAt) ),
        }

    }

}