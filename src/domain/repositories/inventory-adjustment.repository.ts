import { FilterInventoryAdjustment, InventoryAdjustmentResponse } from "../../application/dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { InventoryAdjustment } from "../entities";

export abstract class InventoryAdjustmentRepository {
    abstract save( inventoryAdjustment: InventoryAdjustment ): Promise<InventoryAdjustmentResponse>
    abstract filterInventoryAdjustment( pagination: PaginationDTO, filter: FilterInventoryAdjustment ): Promise<PaginationResponseDto<InventoryAdjustmentResponse>>
    abstract getAllInventoryAdjustments(): Promise<InventoryAdjustmentResponse[]>
}