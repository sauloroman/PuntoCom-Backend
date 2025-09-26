import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { Category } from "../entities";

export abstract class CategoryDatasource {
    abstract findById( categoryId: string ): Promise<Category | null>
    abstract findByName( categoryName: string ): Promise<Category | null>
    abstract create( category: Category ): Promise<Category>
    abstract update( category: Category ): Promise<Category>
    abstract changeStatus( categoryId: string, status: boolean ): Promise<Category>
    abstract getCategories( pagination: PaginationDTO ): Promise<PaginationResponseDto<Category>>
    abstract getAllCategories(): Promise<Category[]>
}