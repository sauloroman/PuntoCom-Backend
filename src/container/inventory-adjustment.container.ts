import { ConnectionPool } from "mssql";
import { InventoryAdjustmentService } from "../application/services/inventory-adjustment.service";
import { FilterInventoryAdjustmentUseCase, SaveInventoryAdjustmentUseCase } from "../application/usecases/inventory-adjustment";
import { UpdateProductUseCase } from "../application/usecases/product";
import { MSSQLInventoryAdjustment, MSSQLProduct, MSSQLUsers } from "../infrastructure/datasource/ms-sql/datasources";
import { InventoryAdjustmentImp } from "../infrastructure/repositories/inventory-adjustment.impl";
import { ProductRepositoryImp } from "../infrastructure/repositories/product.repository.impl";
import { UserRepositoryImpl } from "../infrastructure/repositories/user.repository.impl";
import { InventoryAdjustmentController } from "../presentation/controllers/inventory-adjustment.controller";
import { InventoryAdjustmentRoutes } from "../presentation/routes";
import { Auth } from "../presentation/middlewares";

export class InventoryAdjustmentContainer {

    public readonly inventoryAdjustmentRoutes: InventoryAdjustmentRoutes

    constructor(private readonly pool: ConnectionPool) {

        const inventoryAdjustmentRepositoryMSSQL = new InventoryAdjustmentImp( new MSSQLInventoryAdjustment(this.pool) )
        const productRepositoryMSSQL = new ProductRepositoryImp( new MSSQLProduct(this.pool) )
        const userRepositoryMSSQL = new UserRepositoryImpl( new MSSQLUsers( this.pool ) )
        
        const saveAdjustmentUC = new SaveInventoryAdjustmentUseCase( 
            inventoryAdjustmentRepositoryMSSQL,
            productRepositoryMSSQL,
            userRepositoryMSSQL 
        )
        const updateProductUC = new UpdateProductUseCase( productRepositoryMSSQL )
        const filterAdjustmentsUC = new FilterInventoryAdjustmentUseCase( inventoryAdjustmentRepositoryMSSQL )
        const inventoryAdjustmentService = new InventoryAdjustmentService({
            saveAdjustmentUC: saveAdjustmentUC,
            filterAdjustmentsUC: filterAdjustmentsUC,
            updateProductUC: updateProductUC
        })

        const inventoryAdjustmentController = new InventoryAdjustmentController(inventoryAdjustmentService)

        const auth = new Auth( this.pool )

        this.inventoryAdjustmentRoutes = new InventoryAdjustmentRoutes({
            controller: inventoryAdjustmentController,
            auth: auth
        })

    }

}