import { InventoryAdjustmentRepository } from "../../../domain/repositories";
import { InventoryAdjustmentResponse } from "../../dtos/inventory-adjustment.dto";

export class GetAllInventoryAdjustmentsUseCase {

    constructor(public readonly inventoryAdjustmentRepository: InventoryAdjustmentRepository){}

    public async execute(): Promise<InventoryAdjustmentResponse[]> {
        const adjustments = await this.inventoryAdjustmentRepository.getAllInventoryAdjustments()
        return adjustments
    }

}