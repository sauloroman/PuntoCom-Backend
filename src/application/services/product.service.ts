import { UploadedFile } from "express-fileupload";
import { PaginationDTO } from "../dtos/pagination.dto";
import { ChangeStatusDto, CreateProduct, StockCriteria, UpdateProductRequest } from "../dtos/product.dto";
import { 
    ChangeStatusProductUseCase, 
    CreateProductUseCase, 
    GetAllProductsUseCase, 
    GetProductsByStock, 
    ListProductsUseCase, 
    UpdateProductImageUseCase, 
    UpdateProductUseCase 
} from "../usecases/product";
import { GetProductByIdUseCase } from "../usecases/product/get-product-by-id.use-case";
import { DestroyImageUseCase, UploadImageUseCase } from "../usecases/upload";
import { ApplicationError } from "../errors/application.error";
import { UploadBarCodeUseCase } from "../usecases/upload/upload-bar-code.use-case";

interface ProductServiceOptions {
    getProductByIdUC: GetProductByIdUseCase,
    getAllProductsUC: GetAllProductsUseCase,
    getProductByStockUC: GetProductsByStock,
    createProductUC: CreateProductUseCase,
    updateProductUC: UpdateProductUseCase,
    updateProductImageUC: UpdateProductImageUseCase,
    changeStatusProductUC: ChangeStatusProductUseCase,
    listProductsUC: ListProductsUseCase,

    uploadProductImageUC: UploadImageUseCase,
    uploadBarCodeImageUC: UploadBarCodeUseCase,
    destroyProductImageUC: DestroyImageUseCase
}

export class ProductService {

    private readonly getProductByIdUC: GetProductByIdUseCase
    private readonly getAllProductsUC: GetAllProductsUseCase
    private readonly getProductByStockUC: GetProductsByStock
    private readonly createProductUC: CreateProductUseCase
    private readonly updateProductUC: UpdateProductUseCase 
    private readonly updateProductImageUC: UpdateProductImageUseCase
    private readonly changeStatusProductUC: ChangeStatusProductUseCase 
    private readonly listProductsUC: ListProductsUseCase

    private readonly uploadBarCodeImageUC: UploadBarCodeUseCase
    private readonly uploadProductImageUC: UploadImageUseCase
    private readonly destroyProductImageUC: DestroyImageUseCase

    constructor({ 
        getProductByIdUC, 
        getAllProductsUC,
        getProductByStockUC,
        createProductUC, 
        updateProductUC,
        updateProductImageUC,
        changeStatusProductUC,
        listProductsUC,

        uploadBarCodeImageUC,
        uploadProductImageUC,
        destroyProductImageUC
    }: ProductServiceOptions){
        this.getProductByIdUC = getProductByIdUC
        this.getAllProductsUC = getAllProductsUC
        this.getProductByStockUC = getProductByStockUC
        this.createProductUC = createProductUC
        this.updateProductUC = updateProductUC
        this.updateProductImageUC = updateProductImageUC
        this.changeStatusProductUC = changeStatusProductUC
        this.listProductsUC = listProductsUC

        this.uploadBarCodeImageUC = uploadBarCodeImageUC
        this.uploadProductImageUC = uploadProductImageUC
        this.destroyProductImageUC = destroyProductImageUC
    }    

    public async getProductById( productId: string ) {
        return await this.getProductByIdUC.execute(productId)
    }

    public async createProduct( dto: CreateProduct ) {
        const productCreated = await this.createProductUC.execute(dto) 
        const urlProductCodeImage = await this.uploadBarCodeImageUC.execute(
            'puntocom/products', 
            productCreated.code, 
            productCreated.id 
        )
        return await this.updateProductUC.execute({ id: productCreated.id, imageCode: urlProductCodeImage })
    }

    public async updateProduct( dto: UpdateProductRequest ) {
        return await this.updateProductUC.execute( dto )
    }

    public async changeStatus( dto: ChangeStatusDto ) {
        return await this.changeStatusProductUC.execute( dto )
    }

    public async getAllProducts() {
        return await this.getAllProductsUC.execute()
    }

    public async getProductsByStock( stockCriteria: StockCriteria ) {
        return await this.getProductByStockUC.execute( stockCriteria )
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

}