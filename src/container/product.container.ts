import { ProductService } from "../application/services/product.service";
import { ChangeStatusProductUseCase, GetAllProductsUseCase, ListProductsUseCase, UpdateProductImageUseCase, UpdateProductUseCase } from "../application/usecases/product";
import { CreateProductUseCase } from "../application/usecases/product/create-product.use-case";
import { GetProductByIdUseCase } from "../application/usecases/product/get-product-by-id.use-case";
import { DestroyImageUseCase, UploadBarCodeUseCase, UploadImageUseCase } from "../application/usecases/upload";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaProductDatasource } from "../infrastructure/datasource/prisma/prisma-product.datasource";
import { ProductRepositoryImp } from "../infrastructure/repositories/product.repository.impl";
import { CloudinaryFileUploadService } from "../infrastructure/services/file-upload/cloudinary.service";
import { ProductController } from "../presentation/controllers/product.controller";
import { ProductRoutes } from "../presentation/routes/product.routes";

export class ProductContainer {

    public readonly productRoutes: ProductRoutes

    constructor() {

        const productRepository = new ProductRepositoryImp(
            new PrismaProductDatasource( PrismaDatasource.getInstance() )
        )

        const uploadFilesServices = new CloudinaryFileUploadService()

        const getProductByIdUC = new GetProductByIdUseCase( productRepository )
        const getAllProducts = new GetAllProductsUseCase( productRepository )
        const createProductUC = new CreateProductUseCase( productRepository )
        const updateProductUC = new UpdateProductUseCase( productRepository )
        const updateProductImageUC = new UpdateProductImageUseCase( productRepository )
        const changeStatusUC = new ChangeStatusProductUseCase( productRepository )
        const listProductsUC = new ListProductsUseCase( productRepository )

        const uploadBarCodeImageUC = new UploadBarCodeUseCase( uploadFilesServices )
        const uploadImagesUC = new UploadImageUseCase(uploadFilesServices)
        const destroyImagesUC = new DestroyImageUseCase(uploadFilesServices)

        const productService = new ProductService({
            getProductByIdUC: getProductByIdUC,
            getAllProductsUC: getAllProducts,
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