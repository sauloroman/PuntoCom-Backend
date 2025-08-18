import { CreateCategoryRequestDto, UpdateCategoryRequest } from "../dtos/category.dto";
import { ChangeCategoryStatusUseCase, CreateCategoryUseCase, GetCategoryByIdUseCase, UpdateCategoryUseCase } from "../usecases/categories";

interface CategoryServiceI {
    createCategoryUC: CreateCategoryUseCase,
    getCategoryByIdUC: GetCategoryByIdUseCase,
    updateCategoryUC: UpdateCategoryUseCase,
    changeStatusCategoryUC: ChangeCategoryStatusUseCase
}

export class CategoryService {
    
    private readonly createCategoryUC: CreateCategoryUseCase
    private readonly getCategoryByIdUC: GetCategoryByIdUseCase
    private readonly updateCategoryUC: UpdateCategoryUseCase
    private readonly changeStatusCategoryUC: ChangeCategoryStatusUseCase

    constructor({
        createCategoryUC,
        getCategoryByIdUC,
        updateCategoryUC,
        changeStatusCategoryUC
    }: CategoryServiceI){
        this.createCategoryUC = createCategoryUC
        this.getCategoryByIdUC = getCategoryByIdUC
        this.updateCategoryUC = updateCategoryUC
        this.changeStatusCategoryUC = changeStatusCategoryUC
    }

    async getCategoryById( categoryId: string ) {
        return await this.getCategoryByIdUC.execute(categoryId)
    }

    async createCategory( dto: CreateCategoryRequestDto ) {
        return await this.createCategoryUC.execute( dto )
    }

    async updateCategory( dto: UpdateCategoryRequest ) {
        return await this.updateCategoryUC.execute( dto )
    }

    async changeCategoryStatus( categoryId: string, status: boolean ) {
        return await this.changeStatusCategoryUC.execute({id: categoryId}, status)
    }

}