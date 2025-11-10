import { InventoryAdjustmentResponse } from "../../application/dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { InventoryAdjustmentDatasource } from "../../domain/datasources/inventory-adjustment.datasource";
import { InventoryAdjustment } from "../../domain/entities";
import { InventoryAdjustmentRepository } from "../../domain/repositories/inventory-adjustment.repository";

export class InventoryAdjustmentImp implements InventoryAdjustmentRepository {
    constructor(private readonly inventoryAdjustmentDatasource: InventoryAdjustmentDatasource){}
    
    async getAllInventoryAdjustments(): Promise<InventoryAdjustmentResponse[]> {
        return await this.inventoryAdjustmentDatasource.getAllInventoryAdjustments()
    }
    
    async listInventoryAdjustments(pagination: PaginationDTO): Promise<PaginationResponseDto<InventoryAdjustmentResponse>> {
        return await this.inventoryAdjustmentDatasource.listInventoryAdjustments(pagination)
    }
    
    async save(inventoryAdjustment: InventoryAdjustment): Promise<InventoryAdjustmentResponse> {
        return await this.inventoryAdjustmentDatasource.save(inventoryAdjustment)
    }
}