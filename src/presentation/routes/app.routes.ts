import { Router } from 'express';
import { UserRoutes, CategoryRoutes, SupplierRoutes, ProductRoutes, ReportRoutes } from './';
import { ErrorHandlerMiddleware } from '../middlewares/error-handler.middleware';

interface AppRoutesOptions {
  userRoutes: UserRoutes,
  categoryRoutes: CategoryRoutes,
  supplierRoutes: SupplierRoutes,
  productRoutes: ProductRoutes,
  reportRoutes: ReportRoutes
}

export class AppRoutes {

  public readonly routes: Router;
  private readonly userRoutes: UserRoutes;
  private readonly categoryRoutes: CategoryRoutes
  private readonly supplierRoutes: SupplierRoutes
  private readonly productRoutes: ProductRoutes
  private readonly reportRoutes: ReportRoutes

  constructor({ 
    userRoutes, 
    categoryRoutes,
    supplierRoutes,
    productRoutes,
    reportRoutes
  }: AppRoutesOptions) {
    this.userRoutes = userRoutes
    this.categoryRoutes = categoryRoutes
    this.supplierRoutes = supplierRoutes
    this.productRoutes = productRoutes
    this.reportRoutes = reportRoutes
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()

    router.use('/api/user', this.userRoutes.routes) 
    router.use('/api/category', this.categoryRoutes.routes)
    router.use('/api/supplier', this.supplierRoutes.routes)
    router.use('/api/product', this.productRoutes.routes)
    router.use('/api/report', this.reportRoutes.routes)

    router.use( ErrorHandlerMiddleware.getHandler() )
    
    return  router
  }

}