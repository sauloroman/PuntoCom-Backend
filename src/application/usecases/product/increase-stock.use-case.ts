import { DatesAdapter } from "../../../config/plugins";
import { Product } from "../../../domain/entities";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { Money, ProductCode, Stock } from "../../../domain/value-objects";
import { ProductResponseIncludeDto } from "../../dtos/product.dto";
import { SavePurchaseDetail } from "../../dtos/purchase.dto";
import { ApplicationError } from "../../errors/application.error";

export class IncreaseStockUseCase {

    private readonly MESSAGE_ERROR_NOT_FOUND = 'PRODUCT_NOT_FOUND'
    private readonly MESSAGE_ERROR_NOT_ACTIVE = 'PRODUCT_NOT_ACTIVE'

    constructor(public readonly productRepository: ProductRepository) { }

    public async validate(productId: string): Promise<void> {
        const productExisting = await this.productRepository.findById(productId)
        if (!productExisting) throw new ApplicationError(`El producto con id ${productId} no existe`, this.MESSAGE_ERROR_NOT_FOUND)
        if (!productExisting.isActive) throw new ApplicationError('El producto está desactivado', this.MESSAGE_ERROR_NOT_ACTIVE)
    }

    public async execute(data: SavePurchaseDetail): Promise<ProductResponseIncludeDto> {
        const { productId, quantity } = data
        const productExisting = await this.productRepository.findById(productId) ?? {} as ProductResponseIncludeDto

        const newStock = productExisting.stock + quantity

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
            isActive: true,
            createdAt: DatesAdapter.toLocal(typeof productExisting.createdAt === 'string' ? new Date(productExisting.createdAt) : productExisting.createdAt),
            updatedAt: DatesAdapter.toLocal(DatesAdapter.now()),
        })

        const productNewStock = await this.productRepository.update( product )

        return productNewStock
    }

}