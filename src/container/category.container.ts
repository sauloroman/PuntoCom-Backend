import { CategoryService } from "../application/services"
import { 
    ChangeCategoryStatusUseCase, 
    CreateCategoryUseCase, 
    GetAllCategoriesUseCase, 
    GetCategoryByIdUseCase, 
    ListCategoriesUseCase, 
    UpdateCategoryUseCase, 
    UpdateImageCategoryUseCase 
} from "../application/usecases/categories"
import { DestroyImageUseCase, UploadImageUseCase } from "../application/usecases/upload"

import { PrismaCategoryDatasource, PrismaDatasource } from "../infrastructure/datasource/prisma"
import { CategoryRepositoryImp } from "../infrastructure/repositories"
import { CloudinaryFileUploadService } from "../infrastructure/services"

import { CategoryController } from "../presentation/controllers"
import { CategoryRoutes } from "../presentation/routes"

export class CategoryContainer {

    public readonly categoryRoutes: CategoryRoutes

    constructor() {

        const categoryRepository = new CategoryRepositoryImp(
            new PrismaCategoryDatasource( PrismaDatasource.getInstance() )
        )

        const uploadFileService = new CloudinaryFileUploadService()

        const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
        const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository)
        const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository)
        const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)
        const changeCategoryStatusUseCase = new ChangeCategoryStatusUseCase(categoryRepository)
        const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository)
        const updateCategoryImageUseCase = new UpdateImageCategoryUseCase(categoryRepository)

        const uploadCategoryImageUseCase = new UploadImageUseCase( uploadFileService )
        const destroyCategoryImageUseCase = new DestroyImageUseCase( uploadFileService )

        const categoryService = new CategoryService({   
            createCategoryUC: createCategoryUseCase,
            getCategoryByIdUC: getCategoryByIdUseCase,
            getAllCategoriesUC: getAllCategoriesUseCase,
            updateCategoryUC: updateCategoryUseCase,
            changeStatusCategoryUC: changeCategoryStatusUseCase,
            listCategoriesUC: listCategoriesUseCase,
            updateCategoryImageUC: updateCategoryImageUseCase,

            uploadCategoryImageUC: uploadCategoryImageUseCase,
            destroyCategoryImageUC: destroyCategoryImageUseCase
        })

        const categoryController = new CategoryController(categoryService)

        this.categoryRoutes = new CategoryRoutes({
            controller: categoryController
        })

    }

}