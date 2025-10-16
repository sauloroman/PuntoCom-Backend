import { DatesAdapter } from "../../../config/plugins";
import { Product } from "../../../domain/entities";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { Money, ProductCode, Stock } from "../../../domain/value-objects";
import { ProductResponseIncludeDto } from "../../dtos/product.dto";
import { SaleDetail } from "../../dtos/sale.dto";
import { ApplicationError } from "../../errors/application.error";

export class ReduceStockUseCase {

    private readonly MESSAGE_ERROR_NOT_FOUND = 'PRODUCT_NOT_FOUND'
    private readonly MESSAGE_ERROR_NOT_ENOUGH_STOCK = 'PRODUCT_NOT_ENOUGH_STOCK'
    private readonly MESSAGE_ERROR_NOT_ACTIVE = 'PRODUCT_NOT_ACTIVE'

    constructor(private readonly productRepository: ProductRepository){}

    public async validate( productId: string, quantity: number ): Promise<void> {
        const productExisting = await this.productRepository.findById(productId)
        if ( !productExisting ) throw new ApplicationError(`El producto con id ${productId} no existe`, this.MESSAGE_ERROR_NOT_FOUND )
        if ( !productExisting.isActive ) throw new ApplicationError('El producto está desactivado', this.MESSAGE_ERROR_NOT_ACTIVE )
        if ( productExisting.stock < quantity ) throw new ApplicationError(`No hay suficiente stock de este producto`, this.MESSAGE_ERROR_NOT_ENOUGH_STOCK)
    }

    public async execute( data: SaleDetail ): Promise<ProductResponseIncludeDto> {   
        const {productId, quantity} = data     
        const productExisting = await this.productRepository.findById(productId) ?? {} as ProductResponseIncludeDto

        const newStock = productExisting.stock - quantity

        const product = new Product({
            id: productExisting.id,
            name: productExisting.name,
            description: productExisting.description,
            code: new ProductCode(productExisting.code),
            imageCode: productExisting.imageCode,
            sellingPrice: new Money(productExisting.sellingPrice),
            stock: new Stock(newStock),
            stockMin: new Stock(productExisting.stockMin),
            image: productExisting.image,
            categoryId: productExisting.categoryId,
            supplierId: productExisting.supplierId,
            isActive: newStock > 0,
            createdAt: DatesAdapter.toLocal( typeof productExisting.createdAt === 'string' ? new Date(productExisting.createdAt) : productExisting.createdAt),
            updatedAt: DatesAdapter.toLocal( DatesAdapter.now() ),
        })

        const productNewStock = await this.productRepository.update( product )  

        return productNewStock
    }

}