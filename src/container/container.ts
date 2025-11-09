import { AppRoutes } from '../presentation/routes/app.routes';
import { CategoryContainer } from './category.container';
import { InventoryAdjustmentContainer } from './inventory-adjustment.container';
import { ProductContainer } from './product.container';
import { ReportContainer } from './report.container';
import { SaleContainer } from './sale.container';
import { SupplierContainer } from './supplier.container';
import { UserContainer } from './user.container';

export class Container {

  public readonly appRoutes: AppRoutes;

  constructor() {

    const userContainer = new UserContainer()
    const categoryContainer = new CategoryContainer()
    const supplierContainer = new SupplierContainer()
    const productContainer = new ProductContainer()
    const reportContainer = new ReportContainer()
    const saleContainer = new SaleContainer()
    const inventoryAdjustmentContainer = new InventoryAdjustmentContainer()

    this.appRoutes = new AppRoutes({
      userRoutes: userContainer.userRoutes,
      categoryRoutes: categoryContainer.categoryRoutes,
      supplierRoutes: supplierContainer.supplierRoutes,
      productRoutes: productContainer.productRoutes,
      reportRoutes: reportContainer.reportRoutes,
      saleRoutes: saleContainer.saleRoutes,
      inventoryAdjustmentRoutes: inventoryAdjustmentContainer.inventoryAdjustmentRoutes
    })

  }

}