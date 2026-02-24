import { DatesAdapter } from "../../../config/plugins";
import { Product } from "../../../domain/entities";
import { ProductRepository } from "../../../domain/repositories";
import { Money, ProductCode, Stock } from "../../../domain/value-objects";
import { ProductResponseIncludeDto, UpdateProductImageDto } from "../../dtos/product.dto";

export class UpdateProductImageUseCase {

    constructor(private readonly productRepository: ProductRepository ){}

    public async execute(data: UpdateProductImageDto): Promise<ProductResponseIncludeDto | null> {
        const { id, url } = data

        const existingProduct = await this.productRepository.findById( id )
        if ( !existingProduct ) return null;
    
        const product = new Product({
            id: existingProduct.id,
            name: existingProduct.name,
            description: existingProduct.description,
            code: new ProductCode(existingProduct.code),
            sellingPrice: new Money(existingProduct.sellingPrice),
            stock: new Stock(existingProduct.stock),
            stockMin: new Stock(existingProduct.stockMin),
            image: url,
            imageCode: existingProduct.imageCode,
            categoryId: existingProduct.categoryId,
            supplierId: existingProduct.supplierId,
            isActive: existingProduct.isActive,
            createdAt: DatesAdapter.toLocal( typeof existingProduct.createdAt === 'string' ? new Date(existingProduct.createdAt) : existingProduct.createdAt),
            updatedAt: DatesAdapter.toLocal( DatesAdapter.now() ),
        })

        console.log(product)

        const updatedProduct = await this.productRepository.update(product)

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