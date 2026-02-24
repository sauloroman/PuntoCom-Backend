import { InventoryAdjustmentService } from "../application/services/inventory-adjustment.service";
import { ListInventoryAdjustmentUseCase, SaveInventoryAdjustmentUseCase } from "../application/usecases/inventory-adjustment";
import { UpdateProductUseCase } from "../application/usecases/product";
import { MSSQLInventoryAdjustment, MSSQLProduct, MSSQLUsers } from "../infrastructure/datasource/ms-sql";
import { InventoryAdjustmentImp } from "../infrastructure/repositories/inventory-adjustment.impl";
import { ProductRepositoryImp } from "../infrastructure/repositories/product.repository.impl";
import { UserRepositoryImpl } from "../infrastructure/repositories/user.repository.impl";
import { InventoryAdjustmentController } from "../presentation/controllers/inventory-adjustment";
import { InventoryAdjustmentRoutes } from "../presentation/routes";

export class InventoryAdjustmentContainer {

    public readonly inventoryAdjustmentRoutes: InventoryAdjustmentRoutes

    constructor() {
        const inventoryAdjustmentRepositoryMSSQL = new InventoryAdjustmentImp( new MSSQLInventoryAdjustment() )
        const productRepositoryMSSQL = new ProductRepositoryImp( new MSSQLProduct() )
        const userRepositoryMSSQL = new UserRepositoryImpl( new MSSQLUsers() )
        
        const saveAdjustmentUC = new SaveInventoryAdjustmentUseCase( 
            inventoryAdjustmentRepositoryMSSQL,
            productRepositoryMSSQL,
            userRepositoryMSSQL 
        )
        const updateProductUC = new UpdateProductUseCase( productRepositoryMSSQL )
        const listAdjustmentsUC = new ListInventoryAdjustmentUseCase( inventoryAdjustmentRepositoryMSSQL )
        const inventoryAdjustmentService = new InventoryAdjustmentService({
            saveAdjustmentUC: saveAdjustmentUC,
            listAdjustmentsUC: listAdjustmentsUC,
            updateProductUC: updateProductUC
        })

        const inventoryAdjustmentController = new InventoryAdjustmentController(inventoryAdjustmentService)

        this.inventoryAdjustmentRoutes = new InventoryAdjustmentRoutes({controller: inventoryAdjustmentController})

    }

}