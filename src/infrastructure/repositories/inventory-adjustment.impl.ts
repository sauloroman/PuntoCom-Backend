import { FilterInventoryAdjustment, InventoryAdjustmentResponse } from "../../application/dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { InventoryAdjustmentDatasource } from "../../domain/datasources/inventory-adjustment.datasource";
import { InventoryAdjustment } from "../../domain/entities";
import { InventoryAdjustmentRepository } from "../../domain/repositories/inventory-adjustment.repository";

export class InventoryAdjustmentImp implements InventoryAdjustmentRepository {
    constructor(private readonly inventoryAdjustmentDatasource: InventoryAdjustmentDatasource){}
    
    async filterInventoryAdjustment(pagination: PaginationDTO, filter: FilterInventoryAdjustment): Promise<PaginationResponseDto<InventoryAdjustmentResponse>> {
        return await this.inventoryAdjustmentDatasource.filterInventoryAdjustment(pagination, filter)
    }
    
    async getAllInventoryAdjustments(): Promise<InventoryAdjustmentResponse[]> {
        return await this.inventoryAdjustmentDatasource.getAllInventoryAdjustments()
    }
    
    async save(inventoryAdjustment: InventoryAdjustment): Promise<InventoryAdjustmentResponse> {
        return await this.inventoryAdjustmentDatasource.save(inventoryAdjustment)
    }
}