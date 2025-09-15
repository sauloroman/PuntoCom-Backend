import { UploadedFile } from "express-fileupload";
import { PaginationDTO } from "../dtos/pagination.dto";
import { ChangeStatusDto, CreateProduct, UpdateProductRequest } from "../dtos/product.dto";
import { ChangeStatusProductUseCase, CreateProductUseCase, GetAllProductsUseCase, ListProductsUseCase, UpdateProductImageUseCase, UpdateProductUseCase } from "../usecases/product";
import { GetProductByIdUseCase } from "../usecases/product/get-product-by-id.use-case";
import { DestroyImageUseCase, UploadImageUseCase, UploadPdfUseCase } from "../usecases/upload";
import { ApplicationError } from "../errors/application.error";
import { buildProductsHtml } from "../../config/templates/pdf/list-products-report.template";

interface ProductServiceOptions {
    getProductByIdUC: GetProductByIdUseCase,
    getAllProductsUC: GetAllProductsUseCase,
    createProductUC: CreateProductUseCase,
    updateProductUC: UpdateProductUseCase,
    updateProductImageUC: UpdateProductImageUseCase,
    changeStatusProductUC: ChangeStatusProductUseCase,
    listProductsUC: ListProductsUseCase,

    uploadProductReportUC: UploadPdfUseCase,
    uploadProductImageUC: UploadImageUseCase,
    destroyProductImageUC: DestroyImageUseCase
}

export class ProductService {

    private readonly getProductByIdUC: GetProductByIdUseCase
    private readonly getAllProductsUC: GetAllProductsUseCase
    private readonly createProductUC: CreateProductUseCase
    private readonly updateProductUC: UpdateProductUseCase 
    private readonly updateProductImageUC: UpdateProductImageUseCase
    private readonly changeStatusProductUC: ChangeStatusProductUseCase 
    private readonly listProductsUC: ListProductsUseCase

    private readonly uploadProductReportUC: UploadPdfUseCase
    private readonly uploadProductImageUC: UploadImageUseCase
    private readonly destroyProductImageUC: DestroyImageUseCase

    constructor({ 
        getProductByIdUC, 
        getAllProductsUC,
        createProductUC, 
        updateProductUC,
        updateProductImageUC,
        changeStatusProductUC,
        listProductsUC,

        uploadProductReportUC,
        uploadProductImageUC,
        destroyProductImageUC
    }: ProductServiceOptions){
        this.getProductByIdUC = getProductByIdUC
        this.getAllProductsUC = getAllProductsUC
        this.createProductUC = createProductUC
        this.updateProductUC = updateProductUC
        this.updateProductImageUC = updateProductImageUC
        this.changeStatusProductUC = changeStatusProductUC
        this.listProductsUC = listProductsUC

        this.uploadProductReportUC = uploadProductReportUC
        this.uploadProductImageUC = uploadProductImageUC
        this.destroyProductImageUC = destroyProductImageUC
    }    

    public async getProductById( productId: string ) {
        return await this.getProductByIdUC.execute(productId)
    }

    public async createProduct( dto: CreateProduct ) {
        return await this.createProductUC.execute(dto)
    }

    public async updateProduct( dto: UpdateProductRequest ) {
        return await this.updateProductUC.execute( dto )
    }

    public async changeStatus( dto: ChangeStatusDto ) {
        return await this.changeStatusProductUC.execute( dto )
    }

    public async listSuppliers( pagination: PaginationDTO ) {
        return await this.listProductsUC.execute( pagination )
    }

    public async uploadProductImage( image: UploadedFile, productId: string ) {
        const product = await this.getProductById( productId )
        if ( !product ) throw new ApplicationError(`El producto con id ${productId} no existe`)
        
        if ( product.image !== 'Producto sin imagen' ) {
            await this.destroyProductImageUC.execute(product.image)
        }

        const urlImage = await this.uploadProductImageUC.execute('puntocom/products', image, product.id )
        const updatedProduct = await this.updateProductImageUC.execute({ id: product.id, url: urlImage })
        return updatedProduct
    }

    public async generateListProductsReport() {
        const products = await this.getAllProductsUC.execute()
        const html = buildProductsHtml(products)
        const pdfUrl = await this.uploadProductReportUC.execute(html, { folder: '/reports/products' })
        return pdfUrl
    }

}