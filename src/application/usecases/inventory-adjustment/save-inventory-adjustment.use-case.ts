import { DatesAdapter } from "../../../config/plugins";
import { InventoryAdjustment } from "../../../domain/entities";
import { InventoryAdjustmentRepository } from "../../../domain/repositories/inventory-adjustment.repository";
import { AdjustmentType, Quantity } from "../../../domain/value-objects";
import { InventoryAdjustmentResponse, SaveInventoryAdjustment } from "../../dtos/inventory-adjustment.dto";

export class SaveInventoryAdjustmentUseCase {

    constructor(private readonly inventoryAdjustmentRepository: InventoryAdjustmentRepository){}

    public async execute( data: SaveInventoryAdjustment ): Promise<InventoryAdjustmentResponse> {
        const inventoryAdjustment = new InventoryAdjustment({
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
