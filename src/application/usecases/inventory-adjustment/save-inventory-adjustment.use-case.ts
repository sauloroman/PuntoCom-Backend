import { DatesAdapter } from "../../../config/plugins";
import { InventoryAdjustment } from "../../../domain/entities";
import { InventoryAdjustmentRepository } from "../../../domain/repositories/inventory-adjustment.repository";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { AdjustmentType, Quantity } from "../../../domain/value-objects";
import { InventoryAdjustmentResponse, SaveInventoryAdjustment } from "../../dtos/inventory-adjustment.dto";
import { ApplicationError } from "../../errors/application.error";

export class SaveInventoryAdjustmentUseCase {

    constructor(
        private readonly inventoryAdjustmentRepository: InventoryAdjustmentRepository,
        private readonly productRepository: ProductRepository,
        private readonly userRepository: UserRepository,
    ){}

    public async execute( data: SaveInventoryAdjustment ): Promise<InventoryAdjustmentResponse> {

        const { productId, userId } = data
        
        const product = await this.productRepository.findById( productId )
        if ( !product ) throw new ApplicationError(`El producto con id ${productId} no existe`, 'PRODUCT_NOT_FOUND')
            
        const user = await this.userRepository.findById(userId)
        if ( !user ) throw new ApplicationError(`El usuario con id ${userId} no existe`, 'USER_NOT_FOUND')

        const inventoryAdjustment = new InventoryAdjustment({
            adjustmentPrevQuantity: new Quantity(product.stock),
            adjustmentQuantity: new Quantity( data.adjustmentQuantity ),
            adjustmentReason: data.adjustmentReason,
            adjustmentType: new AdjustmentType( data.adjustmentType ),
            adjustmentDate: DatesAdapter.now(),
            productId: data.productId,
            userId: data.userId,
        })

        return this.inventoryAdjustmentRepository.save( inventoryAdjustment )
    }

}
