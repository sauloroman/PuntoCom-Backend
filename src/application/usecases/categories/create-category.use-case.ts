import { DatesAdapter } from "../../../config/plugins";
import { Category } from "../../../domain/entities";
import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { CategoryResponseDto, CreateCategoryRequestDto } from "../../dtos/category.dto";
import { ApplicationError } from "../../errors/application.error";

export class CreateCategoryUseCase {

    private readonly MESSAGE_ERROR: string = "CREATE_CATEGORY_ERROR"

    constructor( private readonly categoryRepository: CategoryRepository ){}

    public async execute( data: CreateCategoryRequestDto ): Promise<CategoryResponseDto> {
        
        const existingCategory = await this.categoryRepository.findByName( data.name )
        if ( existingCategory ) throw new ApplicationError(`La categoría '${data.name}' ya existe. Intente con otro nombre`, this.MESSAGE_ERROR)

        const category = new Category({
            name: data.name.trim(),
            description: data.description,
            icon: undefined,
            isActive: true,
            createdAt: DatesAdapter.now(),
            updatedAt: DatesAdapter.now()
        })

        const categoryCreated = await this.categoryRepository.create( category )

        return {
            id: categoryCreated.id,
            name: categoryCreated.name,
            description: categoryCreated.description,
            icon: categoryCreated.icon,
            isActive: categoryCreated.isActive,
            createdAt:  DatesAdapter.formatLocal(DatesAdapter.toLocal(category.createdAt)),
            updatedAt:  DatesAdapter.formatLocal(DatesAdapter.toLocal(category.updatedAt)),
        }

    }

}