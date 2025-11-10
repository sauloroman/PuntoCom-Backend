import { InventoryAdjustmentService } from "../application/services/inventory-adjustment.service";
import { ListInventoryAdjustmentUseCase, SaveInventoryAdjustmentUseCase } from "../application/usecases/inventory-adjustment";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaInventoryAdjustmentDatasource } from "../infrastructure/datasource/prisma/prisma-inventory-adjustment.datasource";
import { PrismaProductDatasource } from "../infrastructure/datasource/prisma/prisma-product.datasource";
import { PrismaUserDatasource } from "../infrastructure/datasource/prisma/prisma-user.datasource";
import { InventoryAdjustmentImp } from "../infrastructure/repositories/inventory-adjustment.impl";
import { ProductRepositoryImp } from "../infrastructure/repositories/product.repository.impl";
import { UserRepositoryImpl } from "../infrastructure/repositories/user.repository.impl";
import { InventoryAdjustmentController } from "../presentation/controllers/inventory-adjustment";
import { InventoryAdjustmentRoutes } from "../presentation/routes";

export class InventoryAdjustmentContainer {

    public readonly inventoryAdjustmentRoutes: InventoryAdjustmentRoutes

    constructor() {

        const inventoryAdjustmentRepository = new InventoryAdjustmentImp(
            new PrismaInventoryAdjustmentDatasource( PrismaDatasource.getInstance() )
        )
        const productRepository = new ProductRepositoryImp( new PrismaProductDatasource(PrismaDatasource.getInstance()))
        const userRepository = new UserRepositoryImpl( new PrismaUserDatasource(PrismaDatasource.getInstance()) )

        const saveAdjustmentUC = new SaveInventoryAdjustmentUseCase( 
            inventoryAdjustmentRepository,
            productRepository,
            userRepository 
        )
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