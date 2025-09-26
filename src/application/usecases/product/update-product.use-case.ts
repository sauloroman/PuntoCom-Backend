import { DatesAdapter } from "../../../config/plugins";
import { Product } from "../../../domain/entities";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { Money, ProductCode, Stock } from "../../../domain/value-objects";
import { ProductResponseIncludeDto, UpdateProductRequest } from "../../dtos/product.dto";
import { ApplicationError } from "../../errors/application.error";

export class UpdateProductUseCase {

    private readonly MESSAGE_ERROR_NAME: string = 'UPDATE_PRODUCT_ALREADY_EXISTS_ERROR'
    private readonly MESSAGE_ERROR_ID: string = 'UPDATE_PRODUCT_NOT_EXISTS_ERROR'

    constructor(private readonly productRepository: ProductRepository){}

    public async execute( data: UpdateProductRequest ): Promise<ProductResponseIncludeDto> {

        if ( data.name ) {
            const existingProduct = await this.productRepository.findByName(data.name)
            if ( existingProduct ) throw new ApplicationError(`El producto ${data.name} ya existe. Intente con otro nombre`, this.MESSAGE_ERROR_NAME)
        }

        const productToUpdate: ProductResponseIncludeDto | null = await this.productRepository.findById(data.id)
        if ( !productToUpdate ) throw new ApplicationError(`El producto con id ${data.id} no existe`, this.MESSAGE_ERROR_ID)

        const product = new Product({
            id: productToUpdate.id,
            name: data.name ? data.name : productToUpdate.name,
            description: data.description ? data.description : productToUpdate.description,
            code: new ProductCode(productToUpdate.code),
            imageCode: data.imageCode ? data.imageCode: productToUpdate.imageCode,
            sellingPrice: new Money(data.sellingPrice ? data.sellingPrice : productToUpdate.sellingPrice),
            stock: new Stock(data.stock ? data.stock : productToUpdate.stock),
            stockMin: new Stock(data.stockMin ? data.stockMin : productToUpdate.stockMin),
            image: productToUpdate.image,
            categoryId: data.categoryId ? data.categoryId : productToUpdate.categoryId,
            supplierId: data.supplierId ? data.supplierId : productToUpdate.supplierId,
            isActive: productToUpdate.isActive,
            createdAt: DatesAdapter.toLocal( typeof productToUpdate.createdAt === 'string' ? new Date(productToUpdate.createdAt) : productToUpdate.createdAt
 ),
            updatedAt: DatesAdapter.toLocal( DatesAdapter.now() ),
        })

        const updatedProduct = await this.productRepository.update( product )

        return {
            id: updatedProduct.id,
            name: updatedProduct.name,
            description: updatedProduct.description,
            code: updatedProduct.code,
            image: updatedProduct.image,
            imageCode: updatedProduct.imageCode,
            sellingPrice: updatedProduct.sellingPrice,
            stock: updatedProduct.stock,
            stockMin: updatedProduct.stockMin,
            categoryId: updatedProduct.categoryId,
            supplierId: updatedProduct.supplierId,
            isActive: updatedProduct.isActive,
            createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal( typeof updatedProduct.createdAt === 'string' ? new Date(updatedProduct.createdAt) : updatedProduct.createdAt)),
            updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal( typeof updatedProduct.updatedAt === 'string' ? new Date(updatedProduct.updatedAt) : updatedProduct.updatedAt)),
            Category: updatedProduct.Category,
            Supplier: updatedProduct.Supplier
        }
    }

}