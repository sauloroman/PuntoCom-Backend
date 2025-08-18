import { CategoryService } from "../application/services/category.service";
import { ChangeCategoryStatusUseCase, GetCategoryByIdUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from "../application/usecases/categories";
import { CreateCategoryUseCase } from "../application/usecases/categories/create-category.use-case";
import { PrismaCategoryDatasource } from "../infrastructure/datasource/prisma/prisma-category.datasource";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { CategoryRepositoryImp } from "../infrastructure/repositories/category.repository.impl";
import { CategoryController } from "../presentation/controllers/category.controller";
import { CategoryRoutes } from "../presentation/routes/category.routes";

export class CategoryContainer {

    public readonly categoryRoutes: CategoryRoutes

    constructor() {

        const categoryRepository = new CategoryRepositoryImp(
            new PrismaCategoryDatasource( PrismaDatasource.getInstance() )
        )

        const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
        const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository)
        const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)
        const changeCategoryStatusUseCase = new ChangeCategoryStatusUseCase(categoryRepository)
        const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository)

        const categoryService = new CategoryService({
            createCategoryUC: createCategoryUseCase,
            getCategoryByIdUC: getCategoryByIdUseCase,
            updateCategoryUC: updateCategoryUseCase,
            changeStatusCategoryUC: changeCategoryStatusUseCase,
            listCategoriesUC: listCategoriesUseCase
        })

        const categoryController = new CategoryController(categoryService)

        this.categoryRoutes = new CategoryRoutes({
            controller: categoryController
        })

    }

}