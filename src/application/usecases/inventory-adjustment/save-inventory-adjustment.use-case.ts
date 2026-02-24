import { DatesAdapter, IDAdapter } from "../../../config/plugins";
import { InventoryAdjustment } from "../../../domain/entities";
import { InventoryAdjustmentRepository } from "../../../domain/repositories";
import { ProductRepository, UserRepository } from "../../../domain/repositories";
import { AdjustmentType, Quantity } from "../../../domain/value-objects";
import { InventoryAdjustmentResponse, SaveInventoryAdjustment } from "../../dtos/inventory-adjustment.dto";
import { ApplicationError } from "../../errors/application.error";

export class SaveInventoryAdjustmentUseCase {

    constructor(
        private readonly inventoryAdjustmentRepository: InventoryAdjustmentRepository,
        private readonly productRepository: ProductRepository,
        private readonly userRepository: UserRepository,
    ){}

    public async execute( data: SaveInventoryAdjustment, userId: string ): Promise<InventoryAdjustmentResponse> {

        const { productId } = data
        
        const product = await this.productRepository.findById( productId )
        if ( !product ) throw new ApplicationError(`El producto con id ${productId} no existe`, 'PRODUCT_NOT_FOUND')
            
        const user = await this.userRepository.findById(userId)
        if ( !user ) throw new ApplicationError(`El usuario con id ${userId} no existe`, 'USER_NOT_FOUND')

        const inventoryAdjustment = new InventoryAdjustment({
            id: IDAdapter.generate(),
            adjustmentPrevQuantity: new Quantity(product.stock),
            adjustmentQuantity: new Quantity( data.adjustmentQuantity ),
            adjustmentReason: data.adjustmentReason,
            adjustmentType: new AdjustmentType( data.adjustmentType ),
            adjustmentDate: DatesAdapter.now(),
            productId: data.productId,
            userId: userId,
        })

        return await this.inventoryAdjustmentRepository.save( inventoryAdjustment )
    }

}
