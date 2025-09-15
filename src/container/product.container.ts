import { ProductService } from "../application/services/product.service";
import { ChangeStatusProductUseCase, GetAllProductsUseCase, ListProductsUseCase, UpdateProductImageUseCase, UpdateProductUseCase } from "../application/usecases/product";
import { CreateProductUseCase } from "../application/usecases/product/create-product.use-case";
import { GetProductByIdUseCase } from "../application/usecases/product/get-product-by-id.use-case";
import { DestroyImageUseCase, UploadImageUseCase, UploadPdfUseCase } from "../application/usecases/upload";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaProductDatasource } from "../infrastructure/datasource/prisma/prisma-product.datasource";
import { ProductRepositoryImp } from "../infrastructure/repositories/product.repository.impl";
import { CloudinaryFileUploadService } from "../infrastructure/services/file-upload/cloudinary.service";
import { LocalFileUploadService } from "../infrastructure/services/file-upload/local.service";
import { PuppeteerPdfService } from "../infrastructure/services/pdf/puppeteer.service";
import { ProductController } from "../presentation/controllers/product.controller";
import { ProductRoutes } from "../presentation/routes/product.routes";

export class ProductContainer {

    public readonly productRoutes: ProductRoutes

    constructor() {

        const productRepository = new ProductRepositoryImp(
            new PrismaProductDatasource( PrismaDatasource.getInstance() )
        )

        const uploadImagesService = new CloudinaryFileUploadService()
        const uploadPdfService = new LocalFileUploadService()
        const pdfService = new PuppeteerPdfService()

        const getProductByIdUC = new GetProductByIdUseCase( productRepository )
        const getAllProducts = new GetAllProductsUseCase( productRepository )
        const createProductUC = new CreateProductUseCase( productRepository )
        const updateProductUC = new UpdateProductUseCase( productRepository )
        const updateProductImageUC = new UpdateProductImageUseCase( productRepository )
        const changeStatusUC = new ChangeStatusProductUseCase( productRepository )
        const listProductsUC = new ListProductsUseCase( productRepository )

        const uploadImagesUC = new UploadImageUseCase(uploadImagesService)
        const destroyImagesUC = new DestroyImageUseCase(uploadImagesService)
        const uploadPdfUC = new UploadPdfUseCase( uploadPdfService, pdfService )

        const productService = new ProductService({
            getProductByIdUC: getProductByIdUC,
            getAllProductsUC: getAllProducts,
            createProductUC: createProductUC,
            updateProductUC: updateProductUC,
            updateProductImageUC: updateProductImageUC,
            changeStatusProductUC: changeStatusUC,
            listProductsUC: listProductsUC,

            uploadProductReportUC: uploadPdfUC,
            uploadProductImageUC: uploadImagesUC,
            destroyProductImageUC: destroyImagesUC
        })

        const productController = new ProductController(productService)

        this.productRoutes = new ProductRoutes({
            controller: productController
        })

    }

}