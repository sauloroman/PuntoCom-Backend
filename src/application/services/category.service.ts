import { CreateCategoryRequestDto } from "../dtos/category.dto";
import { CreateCategoryUseCase } from "../usecases/categories/create-category.use-case";

interface CategoryServiceI {
    createCategoryUC: CreateCategoryUseCase
}

export class CategoryService {
    
    private readonly createCategoryUC: CreateCategoryUseCase

    constructor({
        createCategoryUC
    }: CategoryServiceI){
        this.createCategoryUC = createCategoryUC
    }

    async createCategory( dto: CreateCategoryRequestDto ) {
        await this.createCategoryUC.execute( dto )
    }

}