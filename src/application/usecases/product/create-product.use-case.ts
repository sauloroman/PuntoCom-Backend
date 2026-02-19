import { CodeGeneratorAdapter, DatesAdapter, IDAdapter } from "../../../config/plugins";
import { Product } from "../../../domain/entities";
import { ProductRepository } from "../../../domain/repositories";
import { Money, Stock } from "../../../domain/value-objects";
import { CreateProduct, ProductResponseIncludeDto } from "../../dtos/product.dto";
import { ApplicationError } from "../../errors/application.error";

export class CreateProductUseCase {

    private readonly MESSAGE_ERROR: string = "CREATE_PRODUCT_ERROR"

    constructor(private readonly productRepository: ProductRepository){}

    public async execute( data: CreateProduct ): Promise<ProductResponseIncludeDto> {
        
        const existingProduct = await this.productRepository.exists(data.name)
        if ( existingProduct ) throw new ApplicationError(`El nombre ${data.name} ya corresponde a un producto`,this.MESSAGE_ERROR)

        const product = new Product({
            id: IDAdapter.generate(),
            name: data.name.trim(),
            description: data.description?.trim(),
            code: CodeGeneratorAdapter.generateProductCode(),
            stock: new Stock(data.stock),
            stockMin: new Stock(data.stockMin),
            sellingPrice: new Money(data.sellingPrice),
            categoryId: data.categoryId,
            supplierId: data.supplierId,
            imageCode: '',
            isActive: true,
            createdAt: DatesAdapter.now(),
            updatedAt: DatesAdapter.now()
        })

        const createdProduct = await this.productRepository.create(product) 

        return {
            id: createdProduct.id,
            name: createdProduct.name,
            description: createdProduct.description,
            code: createdProduct.code,
            sellingPrice: createdProduct.sellingPrice,
            stock: createdProduct.stock,
            stockMin: createdProduct.stockMin,
            image: createdProduct.image,
            imageCode: '',
            isActive: createdProduct.isActive,
            categoryId: createdProduct.categoryId,
            supplierId: createdProduct.supplierId,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(product.createdAt)),
            updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(product.updatedAt)),
            Category: createdProduct.Category,
            Supplier: createdProduct.Supplier
        }

    }

}