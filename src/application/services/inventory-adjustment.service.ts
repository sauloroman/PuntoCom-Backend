import { FilterInventoryAdjustment, SaveInventoryAdjustment } from "../dtos/inventory-adjustment.dto";
import { PaginationDTO } from "../dtos/pagination.dto";
import { FilterInventoryAdjustmentUseCase, SaveInventoryAdjustmentUseCase } from "../usecases/inventory-adjustment";
import { UpdateProductUseCase } from "../usecases/product";

interface InventoryAdjustmentServiceOptions {
    saveAdjustmentUC: SaveInventoryAdjustmentUseCase,
    filterAdjustmentsUC: FilterInventoryAdjustmentUseCase,
    updateProductUC: UpdateProductUseCase
}

export class InventoryAdjustmentService {

    private readonly saveAdjustmentUC: SaveInventoryAdjustmentUseCase
    private readonly filterAdjustmentsUC: FilterInventoryAdjustmentUseCase
    private readonly updateProductUC: UpdateProductUseCase

    constructor({
        saveAdjustmentUC,
        filterAdjustmentsUC,
        updateProductUC
    }: InventoryAdjustmentServiceOptions) {
        this.saveAdjustmentUC = saveAdjustmentUC
        this.filterAdjustmentsUC = filterAdjustmentsUC
        this.updateProductUC = updateProductUC
    }

    public async saveInventoryAdjustment( dto: SaveInventoryAdjustment, userId: string ) {
        const inventorySaved = await this.saveAdjustmentUC.execute( dto, userId )
        await this.updateProductUC.execute({ id: dto.productId, stock: dto.adjustmentQuantity })
        return inventorySaved
    }

    public async filterInventoryAdjustments( pagination: PaginationDTO, filter: FilterInventoryAdjustment ) {
        return await this.filterAdjustmentsUC.execute( pagination, filter )
    }

}