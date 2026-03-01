import { FilterCategories, PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { Category } from "../entities";

export abstract class CategoryRepository {
    abstract findById( categoryId: string ): Promise<Category | null>
    abstract findByName( categoryName: string ): Promise<Category | null>
    abstract exists( categoryName: string ): Promise<boolean>
    abstract create( category: Category ): Promise<Category>
    abstract update( category: Category ): Promise<Category>
    abstract changeStatus( categoryId: string, status: boolean ): Promise<Category>
    abstract filterCategories( pagination: PaginationDTO, filter: FilterCategories ): Promise<PaginationResponseDto<Category>>
    abstract getAllCategories(): Promise<Category[]>
}