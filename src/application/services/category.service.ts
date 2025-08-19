import { UploadedFile } from "express-fileupload";
import { CreateCategoryRequestDto, UpdateCategoryRequest } from "../dtos/category.dto";
import { PaginationDTO } from "../dtos/pagination.dto";
import { ChangeCategoryStatusUseCase, CreateCategoryUseCase, GetCategoryByIdUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from "../usecases/categories";
import { DestroyImageUseCase, UploadImageUseCase } from "../usecases/upload";
import { ApplicationError } from "../errors/application.error";
import { UpdateImageCategoryUseCase } from "../usecases/categories/update-image-category.use-case";

interface CategoryServiceI {
    createCategoryUC: CreateCategoryUseCase,
    getCategoryByIdUC: GetCategoryByIdUseCase,
    updateCategoryUC: UpdateCategoryUseCase,
    changeStatusCategoryUC: ChangeCategoryStatusUseCase
    listCategoriesUC: ListCategoriesUseCase,
    updateCategoryImageUC: UpdateImageCategoryUseCase

    uploadCategoryImageUC: UploadImageUseCase,
    destroyCategoryImageUC: DestroyImageUseCase
}

export class CategoryService {
    
    private readonly createCategoryUC: CreateCategoryUseCase
    private readonly getCategoryByIdUC: GetCategoryByIdUseCase
    private readonly updateCategoryUC: UpdateCategoryUseCase
    private readonly changeStatusCategoryUC: ChangeCategoryStatusUseCase
    private readonly listCategoriesUC: ListCategoriesUseCase
    private readonly updateCategoryImageUC: UpdateImageCategoryUseCase

    private readonly uploadCategoryImageUC: UploadImageUseCase
    private readonly destroyCategoryImageUC: DestroyImageUseCase    

    constructor({
        createCategoryUC,
        getCategoryByIdUC,
        updateCategoryUC,
        changeStatusCategoryUC,
        listCategoriesUC,
        updateCategoryImageUC,
        uploadCategoryImageUC,
        destroyCategoryImageUC
    }: CategoryServiceI){
        this.createCategoryUC = createCategoryUC
        this.getCategoryByIdUC = getCategoryByIdUC
        this.updateCategoryUC = updateCategoryUC
        this.changeStatusCategoryUC = changeStatusCategoryUC
        this.listCategoriesUC = listCategoriesUC
        this.updateCategoryImageUC = updateCategoryImageUC

        this.uploadCategoryImageUC = uploadCategoryImageUC
        this.destroyCategoryImageUC = destroyCategoryImageUC
    }

    async uploadCategoryImage( image: UploadedFile, categoryId: string ) {
        const category = await this.getCategoryById( categoryId )
        if ( !category ) throw new ApplicationError(`La categoría con id ${categoryId} no existe`)
        
        if ( category.icon !== 'Categoría sin ícono' ) {
            await this.destroyCategoryImageUC.execute( category.icon )
        }

        const urlImage = await this.uploadCategoryImageUC.execute("puntocom/categories", image, categoryId)
        const updatedCategory = await this.updateCategoryImageUC.execute({ id: categoryId, url: urlImage })
        return updatedCategory
    }

    async listCategories(dto: PaginationDTO) {
        return await this.listCategoriesUC.execute(dto)
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