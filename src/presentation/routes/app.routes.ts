import { Router } from 'express';
import { UserRoutes, CategoryRoutes, SupplierRoutes, ProductRoutes } from './';
import { ErrorHandlerMiddleware } from '../middlewares/error-handler.middleware';

interface AppRoutesOptions {
  userRoutes: UserRoutes,
  categoryRoutes: CategoryRoutes,
  supplierRoutes: SupplierRoutes,
  productRoutes: ProductRoutes
}

export class AppRoutes {

  public readonly routes: Router;
  private readonly userRoutes: UserRoutes;
  private readonly categoryRoutes: CategoryRoutes
  private readonly supplierRoutes: SupplierRoutes
  private readonly productRoutes: ProductRoutes

  constructor({ 
    userRoutes, 
    categoryRoutes,
    supplierRoutes,
    productRoutes
  }: AppRoutesOptions) {
    this.userRoutes = userRoutes
    this.categoryRoutes = categoryRoutes
    this.supplierRoutes = supplierRoutes
    this.productRoutes = productRoutes
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()

    router.use('/api/user', this.userRoutes.routes) 
    router.use('/api/category', this.categoryRoutes.routes)
    router.use('/api/supplier', this.supplierRoutes.routes)
    router.use('/api/product', this.productRoutes.routes)

    router.use( ErrorHandlerMiddleware.getHandler() )
    
    return  router
  }

}