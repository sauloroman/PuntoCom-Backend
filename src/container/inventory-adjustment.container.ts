import { InventoryAdjustmentService } from "../application/services/inventory-adjustment.service";
import { ListInventoryAdjustmentUseCase, SaveInventoryAdjustmentUseCase } from "../application/usecases/inventory-adjustment";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaInventoryAdjustmentDatasource } from "../infrastructure/datasource/prisma/prisma-inventory-adjustment.datasource";
import { InventoryAdjustmentImp } from "../infrastructure/repositories/inventory-adjustment.impl";
import { InventoryAdjustmentController } from "../presentation/controllers/inventory-adjustment";
import { InventoryAdjustmentRoutes } from "../presentation/routes";

export class InventoryAdjustmentContainer {

    public readonly inventoryAdjustmentRoutes: InventoryAdjustmentRoutes

    constructor() {

        const inventoryAdjustmentRepository = new InventoryAdjustmentImp(
            new PrismaInventoryAdjustmentDatasource( PrismaDatasource.getInstance() )
        )

        const saveAdjustmentUC = new SaveInventoryAdjustmentUseCase( inventoryAdjustmentRepository )
        const listAdjustmentsUC = new ListInventoryAdjustmentUseCase( inventoryAdjustmentRepository )

        const inventoryAdjustmentService = new InventoryAdjustmentService({
            saveAdjustmentUC: saveAdjustmentUC,
            listAdjustmentsUC: listAdjustmentsUC
        })

        const inventoryAdjustmentController = new InventoryAdjustmentController(inventoryAdjustmentService)

        this.inventoryAdjustmentRoutes = new InventoryAdjustmentRoutes({
            controller: inventoryAdjustmentController
        })

    }

}