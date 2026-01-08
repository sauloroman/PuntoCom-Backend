import { InventoryAdjustmentRepository } from "../../../domain/repositories";
import { InventoryAdjustmentResponse } from "../../dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";

export class ListInventoryAdjustmentUseCase {

    constructor( private readonly inventoryAdjustmentRepository: InventoryAdjustmentRepository){}

    public async execute( pagination: PaginationDTO ): Promise<PaginationResponseDto<InventoryAdjustmentResponse>> {
        return await this.inventoryAdjustmentRepository.listInventoryAdjustments(pagination)
    }

}