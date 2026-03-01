import { ConnectionPool } from 'mssql';
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
import { MssqlClient } from '../infrastructure/datasource/ms-sql/datasources';

export class Container {

  public readonly appRoutes: AppRoutes;

  private constructor(pool: ConnectionPool) {

    const userContainer = new UserContainer(pool)
    const categoryContainer = new CategoryContainer(pool)
    const supplierContainer = new SupplierContainer(pool)
    const productContainer = new ProductContainer(pool)
    const reportContainer = new ReportContainer(pool)
    const saleContainer = new SaleContainer(pool)
    const purchaseContainer = new PurchaseContainer(pool)
    const inventoryAdjustmentContainer = new InventoryAdjustmentContainer(pool)
    const dashboardStatsContainer = new DashboardStatsContainer(pool)

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

  public static async create(): Promise<Container> {
    const pool = await MssqlClient.getConnection()
    const container = new Container(pool)
    return container
  }

}