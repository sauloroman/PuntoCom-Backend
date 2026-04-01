import { InventoryAdjustmentRepository } from "../../../domain/repositories";
import { FilterInventoryAdjustment, InventoryAdjustmentResponse } from "../../dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";

export class FilterInventoryAdjustmentUseCase {

    constructor( private readonly inventoryAdjustmentRepository: InventoryAdjustmentRepository){}

    public async execute( pagination: PaginationDTO, filter: FilterInventoryAdjustment ): Promise<PaginationResponseDto<InventoryAdjustmentResponse>> {
        return await this.inventoryAdjustmentRepository.filterInventoryAdjustment(pagination, filter)
    }

}