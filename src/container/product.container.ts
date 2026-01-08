import { ProductService } from "../application/services"
import { 
    ChangeStatusProductUseCase, 
    CreateProductUseCase, 
    GetAllProductsUseCase, 
    GetMinimalInformationProductsUseCase, 
    GetProductByIdUseCase, 
    GetProductsByStock, 
    ListProductsUseCase, 
    UpdateProductImageUseCase, 
    UpdateProductUseCase 
} from "../application/usecases/product"
import { DestroyImageUseCase, UploadBarCodeUseCase, UploadImageUseCase } from "../application/usecases/upload"
import { PrismaDatasource, PrismaProductDatasource } from "../infrastructure/datasource/prisma"
import { ProductRepositoryImp } from "../infrastructure/repositories"
import { CloudinaryFileUploadService } from "../infrastructure/services"
import { ProductController } from "../presentation/controllers"
import { ProductRoutes } from "../presentation/routes"

export class ProductContainer {

    public readonly productRoutes: ProductRoutes

    constructor() {

        const productRepository = new ProductRepositoryImp(
            new PrismaProductDatasource( PrismaDatasource.getInstance() )
        )

        const uploadFilesServices = new CloudinaryFileUploadService()

        const getAllProducts = new GetAllProductsUseCase(productRepository)
        const getProductByIdUC = new GetProductByIdUseCase( productRepository )
        const getMinimalInformationProducts = new GetMinimalInformationProductsUseCase( productRepository )
        const getProductsByStock = new GetProductsByStock( productRepository )
        const createProductUC = new CreateProductUseCase( productRepository )
        const updateProductUC = new UpdateProductUseCase( productRepository )
        const updateProductImageUC = new UpdateProductImageUseCase( productRepository )
        const changeStatusUC = new ChangeStatusProductUseCase( productRepository )
        const listProductsUC = new ListProductsUseCase( productRepository )

        const uploadBarCodeImageUC = new UploadBarCodeUseCase( uploadFilesServices )
        const uploadImagesUC = new UploadImageUseCase(uploadFilesServices)
        const destroyImagesUC = new DestroyImageUseCase(uploadFilesServices)

        const productService = new ProductService({
            getAllProductsUC: getAllProducts,
            getProductByIdUC: getProductByIdUC,
            getMinimalInformationProductsUC: getMinimalInformationProducts,
            getProductByStockUC: getProductsByStock,
            createProductUC: createProductUC,
            updateProductUC: updateProductUC,
            updateProductImageUC: updateProductImageUC,
            changeStatusProductUC: changeStatusUC,
            listProductsUC: listProductsUC,

            uploadBarCodeImageUC: uploadBarCodeImageUC,
            uploadProductImageUC: uploadImagesUC,
            destroyProductImageUC: destroyImagesUC
        })

        const productController = new ProductController(productService)

        this.productRoutes = new ProductRoutes({
            controller: productController
        })

    }

}