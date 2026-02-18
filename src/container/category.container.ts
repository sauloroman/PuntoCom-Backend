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
import { MSSQLCategory } from "../infrastructure/datasource/ms-sql"
import { CategoryRepositoryImp } from "../infrastructure/repositories"
import { CloudinaryFileUploadService } from "../infrastructure/services"
import { CategoryController } from "../presentation/controllers"
import { CategoryRoutes } from "../presentation/routes"

export class CategoryContainer {

    public readonly categoryRoutes: CategoryRoutes

    constructor() {

        // #################### Repositories #################### 
        
        // const categoryRepositoryPrisma = new CategoryRepositoryImp( new PrismaCategoryDatasource( PrismaDatasource.getInstance() ) )
        const categoryRepositoryMSSQL = new CategoryRepositoryImp( new MSSQLCategory() )
        const uploadFileService = new CloudinaryFileUploadService()
        
        // #################### Use Cases ####################
        const createCategoryUseCase = new CreateCategoryUseCase(categoryRepositoryMSSQL)
        const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepositoryMSSQL)
        const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepositoryMSSQL)
        const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepositoryMSSQL)
        const changeCategoryStatusUseCase = new ChangeCategoryStatusUseCase(categoryRepositoryMSSQL)
        const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepositoryMSSQL)
        const updateCategoryImageUseCase = new UpdateImageCategoryUseCase(categoryRepositoryMSSQL)

        const uploadCategoryImageUseCase = new UploadImageUseCase( uploadFileService )
        const destroyCategoryImageUseCase = new DestroyImageUseCase( uploadFileService )

        // #################### Services ####################
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

        this.categoryRoutes = new CategoryRoutes({ controller: categoryController })
    }

}