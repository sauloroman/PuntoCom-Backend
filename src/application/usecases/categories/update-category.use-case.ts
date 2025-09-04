import { DatesAdapter } from "../../../config/plugins";
import { Category } from "../../../domain/entities";
import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { CategoryResponseDto, UpdateCategoryRequest } from "../../dtos/category.dto";
import { ApplicationError } from "../../errors/application.error";

export class UpdateCategoryUseCase {

    private readonly MESSAGE_ERROR: string = "UPDATE_CATEGORY_ALREADY_EXISTS_ERROR"
    private readonly MESSAGE_ERROR2: string = "UPDATE_CATEGORY_NOT_EXISTS_ERROR"

    constructor(private readonly categoryRepository: CategoryRepository){}

    public async execute( data: UpdateCategoryRequest ): Promise<CategoryResponseDto> {

        if ( data.name ) {
            const existingCategory = await this.categoryRepository.findByName( data.name! )
            if ( existingCategory ) throw new ApplicationError(`La categoría ${data.name} ya existe. Intente con otro nombre`, this.MESSAGE_ERROR)
        }
        
        const categoryToUpdate = await this.categoryRepository.findById( data.id )
        if ( !categoryToUpdate ) throw new ApplicationError(`La categoría con id ${data.id} no existe.`, this.MESSAGE_ERROR2 )

        const { isActive, createdAt, description, icon, id, name } = categoryToUpdate

        const category = new Category({
            id: id,
            name: data.name ? data.name : name,
            description: data.description ? data.description : description,
            icon: icon,
            isActive: isActive,
            createdAt: DatesAdapter.toLocal(createdAt), 
            updatedAt: DatesAdapter.toLocal( DatesAdapter.now() )
        })

        const categoryUpdated = await this.categoryRepository.update( category )

        return {
            id: categoryUpdated.id,
            name: categoryUpdated.name,
            description: categoryUpdated.description,
            icon: categoryUpdated.icon,
            isActive: categoryUpdated.isActive,
            createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(categoryUpdated.createdAt)),
            updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(categoryUpdated.updatedAt))
        }

    }

}