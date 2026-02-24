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
import { MSSQLProduct } from "../infrastructure/datasource/ms-sql"
import { ProductRepositoryImp } from "../infrastructure/repositories"
import { CloudinaryFileUploadService } from "../infrastructure/services"
import { ProductController } from "../presentation/controllers"
import { ProductRoutes } from "../presentation/routes"

export class ProductContainer {

    public readonly productRoutes: ProductRoutes

    constructor() {

        // const productRepositoryPrisma = new ProductRepositoryImp( new PrismaProductDatasource( PrismaDatasource.getInstance()))
        const productRepositoryMSSQL = new ProductRepositoryImp( new MSSQLProduct() )

        const uploadFilesServices = new CloudinaryFileUploadService()

        const getAllProducts = new GetAllProductsUseCase(productRepositoryMSSQL)
        const getProductByIdUC = new GetProductByIdUseCase( productRepositoryMSSQL )
        const getMinimalInformationProducts = new GetMinimalInformationProductsUseCase( productRepositoryMSSQL )
        const getProductsByStock = new GetProductsByStock( productRepositoryMSSQL )
        const createProductUC = new CreateProductUseCase( productRepositoryMSSQL )
        const updateProductUC = new UpdateProductUseCase( productRepositoryMSSQL )
        const updateProductImageUC = new UpdateProductImageUseCase( productRepositoryMSSQL )
        const changeStatusUC = new ChangeStatusProductUseCase( productRepositoryMSSQL )
        const listProductsUC = new ListProductsUseCase( productRepositoryMSSQL )

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