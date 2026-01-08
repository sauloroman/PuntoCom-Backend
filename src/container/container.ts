import { AppRoutes } from '../presentation/routes/app.routes';
import { 
  CategoryContainer, 
  DashboardStatsContainer, 
  InventoryAdjustmentContainer, 
  ProductContainer, 
  PurchaseContainer, 
  ReportContainer, 
  SaleContainer, 
  SupplierContainer, 
  UserContainer 
} from './';

export class Container {

  public readonly appRoutes: AppRoutes;

  constructor() {

    const userContainer = new UserContainer()
    const categoryContainer = new CategoryContainer()
    const supplierContainer = new SupplierContainer()
    const productContainer = new ProductContainer()
    const reportContainer = new ReportContainer()
    const saleContainer = new SaleContainer()
    const purchaseContainer = new PurchaseContainer()
    const inventoryAdjustmentContainer = new InventoryAdjustmentContainer()
    const dashboardStatsContainer = new DashboardStatsContainer()

    this.appRoutes = new AppRoutes({
      userRoutes: userContainer.userRoutes,
      categoryRoutes: categoryContainer.categoryRoutes,
      supplierRoutes: supplierContainer.supplierRoutes,
      productRoutes: productContainer.productRoutes,
      reportRoutes: reportContainer.reportRoutes,
      saleRoutes: saleContainer.saleRoutes,
      purchaseRoutes: purchaseContainer.purchaseRoutes,
      inventoryAdjustmentRoutes: inventoryAdjustmentContainer.inventoryAdjustmentRoutes,
      dashboardStatsRoutes: dashboardStatsContainer.dashboardStatsRoutes
    })

  }

}