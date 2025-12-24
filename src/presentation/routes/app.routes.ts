import { Router } from 'express';
import { UserRoutes, CategoryRoutes, SupplierRoutes, SaleRoutes, ProductRoutes, ReportRoutes, InventoryAdjustmentRoutes } from './';
import { ErrorHandlerMiddleware } from '../middlewares/error-handler.middleware';
import { PurchaseRoutes } from './purchase.routes';

interface AppRoutesOptions {
  userRoutes: UserRoutes,
  categoryRoutes: CategoryRoutes,
  supplierRoutes: SupplierRoutes,
  productRoutes: ProductRoutes,
  reportRoutes: ReportRoutes
  saleRoutes: SaleRoutes,
  purchaseRoutes: PurchaseRoutes,
  inventoryAdjustmentRoutes: InventoryAdjustmentRoutes
}

export class AppRoutes {

  public readonly routes: Router;
  private readonly userRoutes: UserRoutes;
  private readonly categoryRoutes: CategoryRoutes
  private readonly supplierRoutes: SupplierRoutes
  private readonly productRoutes: ProductRoutes
  private readonly reportRoutes: ReportRoutes
  private readonly saleRoutes: SaleRoutes
  private readonly purchaseRoutes: PurchaseRoutes
  private readonly inventoryAdjustmentRoutes: InventoryAdjustmentRoutes

  constructor({ 
    userRoutes, 
    categoryRoutes,
    supplierRoutes,
    productRoutes,
    reportRoutes,
    saleRoutes,
    purchaseRoutes,
    inventoryAdjustmentRoutes
  }: AppRoutesOptions) {
    this.userRoutes = userRoutes
    this.categoryRoutes = categoryRoutes
    this.supplierRoutes = supplierRoutes
    this.productRoutes = productRoutes
    this.reportRoutes = reportRoutes
    this.saleRoutes = saleRoutes
    this.purchaseRoutes = purchaseRoutes
    this.inventoryAdjustmentRoutes = inventoryAdjustmentRoutes
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()
    router.use('/api/user', this.userRoutes.routes) 
    router.use('/api/category', this.categoryRoutes.routes)
    router.use('/api/supplier', this.supplierRoutes.routes)
    router.use('/api/product', this.productRoutes.routes)
    router.use('/api/report', this.reportRoutes.routes)
    router.use('/api/sale', this.saleRoutes.routes )
    router.use('/api/purchase', this.purchaseRoutes.routes )
    router.use('/api/inventory-adjustment', this.inventoryAdjustmentRoutes.routes )
    router.use( ErrorHandlerMiddleware.getHandler() )
    return  router
  }

}