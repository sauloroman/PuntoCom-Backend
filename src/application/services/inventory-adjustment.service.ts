import { SaveInventoryAdjustment } from "../dtos/inventory-adjustment.dto";
import { PaginationDTO } from "../dtos/pagination.dto";
import { ListInventoryAdjustmentUseCase, SaveInventoryAdjustmentUseCase } from "../usecases/inventory-adjustment";

interface InventoryAdjustmentServiceOptions {
    saveAdjustmentUC: SaveInventoryAdjustmentUseCase,
    listAdjustmentsUC: ListInventoryAdjustmentUseCase
}

export class InventoryAdjustmentService {

    private readonly saveAdjustmentUC: SaveInventoryAdjustmentUseCase
    private readonly listAdjustmentsUC: ListInventoryAdjustmentUseCase

    constructor({
        saveAdjustmentUC,
        listAdjustmentsUC
    }: InventoryAdjustmentServiceOptions) {
        this.saveAdjustmentUC = saveAdjustmentUC
        this.listAdjustmentsUC = listAdjustmentsUC
    }

    public async saveInventoryAdjustment( dto: SaveInventoryAdjustment ) {
        return await this.saveAdjustmentUC.execute( dto )
    }

    public async listAdjustments( pagination: PaginationDTO ) {
        return await this.listAdjustmentsUC.execute( pagination )
    }

}