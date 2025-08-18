import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { Category } from "../../domain/entities";
import { CategoryRepository } from "../../domain/repositories/category.repository";

export class CategoryRepositoryImp implements CategoryRepository {
    
    constructor(private readonly categoryDatasource: CategoryDatasource){}

    async findById(categoryId: string): Promise<Category | null> {
        return await this.categoryDatasource.findById( categoryId )
    }
    
    async findByName(categoryName: string): Promise<Category | null> {
        return await this.categoryDatasource.findByName( categoryName )
    }
    
    async create(category: Category): Promise<Category> {
        return await this.categoryDatasource.create( category )
    }
    
    async update(category: Category): Promise<Category> {
        return await this.categoryDatasource.update( category )
    }
    
    async changeStatus(categoryId: string, status: boolean): Promise<Category> {
        return await this.categoryDatasource.changeStatus( categoryId, status )
    }
    
    async getCategories(pagination: PaginationDTO): Promise<PaginationResponseDto<Category>> {
        throw new Error("Method not implemented.");
    }

}