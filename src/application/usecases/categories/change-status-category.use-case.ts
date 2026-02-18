import { DatesAdapter } from "../../../config/plugins";
import { CategoryRepository } from "../../../domain/repositories";
import { CategoryResponseDto, ChangeCategoryStatusRequestDto } from "../../dtos/category.dto";
import { ApplicationError } from "../../errors/application.error";

export class ChangeCategoryStatusUseCase {

    private readonly MESSAGE_ERROR = 'CHANGE_CATEGORY_STATUS_ERROR'

    constructor(public readonly categoryRepository: CategoryRepository){}

    public async execute( data: ChangeCategoryStatusRequestDto, status: boolean ): Promise<CategoryResponseDto> {

        const existingCategory = await this.categoryRepository.findById( data.id )
        if (!existingCategory) throw new ApplicationError(`La categoría con id ${data.id} no existe`, this.MESSAGE_ERROR )
        if ( status && existingCategory.isActive ) throw new ApplicationError('La categoría ya está activa')
        if ( !status && !existingCategory.isActive ) throw new ApplicationError('La categoría ya está desactivada')

        const category = await this.categoryRepository.changeStatus(data.id, status)
    
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            icon: category.icon,
            isActive: category.isActive,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(category.createdAt) ),
            updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(category.updatedAt) )
        }

    }

}