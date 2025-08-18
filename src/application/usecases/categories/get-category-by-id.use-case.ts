import { DatesAdapter } from "../../../config/plugins";
import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { CategoryResponseDto } from "../../dtos/category.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetCategoryByIdUseCase {

    private readonly MESSAGE_ERROR: string = "GET_CATEGORY_BY_ID_ERROR"

    constructor(private readonly categoryRepository: CategoryRepository){}

    public async execute( categoryId: string ): Promise<CategoryResponseDto> {

        const category = await this.categoryRepository.findById( categoryId )
        if ( !category ) throw new ApplicationError('No se pudo obtener la categoría por id', this.MESSAGE_ERROR )

        return {
            id: category.id,
            name: category.name,
            description: category.description,
            icon: category.icon,
            isActive: category.isActive,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(category.createdAt) ),
            updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(category.updatedAt) ),
        }

    }

}