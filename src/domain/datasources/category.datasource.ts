import { Category } from "../entities";

export abstract class CategoryDatasource {
    abstract findById( categoryId: string ): Promise<Category | null>
    abstract findByName( categoryName: string ): Promise<Category | null>
    abstract findAllActive(): Promise<Category[]>
    abstract findAllInactive(): Promise<Category[]>
    abstract create( category: Category ): Promise<Category>
    abstract update( category: Category ): Promise<Category>
    abstract changeStatus( categoryId: string, status: boolean ): Promise<Category>
}