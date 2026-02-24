import { SaveInventoryAdjustment } from "../dtos/inventory-adjustment.dto";
import { PaginationDTO } from "../dtos/pagination.dto";
import { ListInventoryAdjustmentUseCase, SaveInventoryAdjustmentUseCase } from "../usecases/inventory-adjustment";
import { UpdateProductUseCase } from "../usecases/product";

interface InventoryAdjustmentServiceOptions {
    saveAdjustmentUC: SaveInventoryAdjustmentUseCase,
    listAdjustmentsUC: ListInventoryAdjustmentUseCase,
    updateProductUC: UpdateProductUseCase
}

export class InventoryAdjustmentService {

    private readonly saveAdjustmentUC: SaveInventoryAdjustmentUseCase
    private readonly listAdjustmentsUC: ListInventoryAdjustmentUseCase
    private readonly updateProductUC: UpdateProductUseCase

    constructor({
        saveAdjustmentUC,
        listAdjustmentsUC,
        updateProductUC
    }: InventoryAdjustmentServiceOptions) {
        this.saveAdjustmentUC = saveAdjustmentUC
        this.listAdjustmentsUC = listAdjustmentsUC
        this.updateProductUC = updateProductUC
    }

    public async saveInventoryAdjustment( dto: SaveInventoryAdjustment, userId: string ) {
        await this.saveAdjustmentUC.execute( dto, userId )
        await this.updateProductUC.execute({ id: dto.productId, stock: dto.adjustmentQuantity })
    }

    public async listAdjustments( pagination: PaginationDTO ) {
        return await this.listAdjustmentsUC.execute( pagination )
    }

}