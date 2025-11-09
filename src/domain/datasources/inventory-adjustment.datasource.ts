import { InventoryAdjustmentResponse } from "../../application/dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { InventoryAdjustment } from "../entities";

export abstract class InventoryAdjustmentDatasource {
    abstract save( inventoryAdjustment: InventoryAdjustment ): Promise<InventoryAdjustmentResponse>
    abstract listInventoryAdjustments( pagination: PaginationDTO ): Promise<PaginationResponseDto<InventoryAdjustmentResponse>>
    abstract getInventoryAdjustmentsByUser( userId: string, pagination: PaginationDTO ): Promise<PaginationResponseDto<InventoryAdjustmentResponse>>
}