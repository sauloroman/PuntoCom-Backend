import { Router } from 'express';
import { UserRoutes, CategoryRoutes, SupplierRoutes } from './';
import { ErrorHandlerMiddleware } from '../middlewares/error-handler.middleware';

interface AppRoutesOptions {
  userRoutes: UserRoutes,
  categoryRoutes: CategoryRoutes,
  supplierRoutes: SupplierRoutes
}

export class AppRoutes {

  public readonly routes: Router;
  private readonly userRoutes: UserRoutes;
  private readonly categoryRoutes: CategoryRoutes
  private readonly supplierRoutes: SupplierRoutes

  constructor({ 
    userRoutes, 
    categoryRoutes,
    supplierRoutes
  }: AppRoutesOptions) {
    this.userRoutes = userRoutes
    this.categoryRoutes = categoryRoutes
    this.supplierRoutes = supplierRoutes
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()

    router.use('/api/user', this.userRoutes.routes) 
    router.use('/api/category', this.categoryRoutes.routes)
    router.use('/api/supplier', this.supplierRoutes.routes)

    router.use( ErrorHandlerMiddleware.getHandler() )
    
    return  router
  }

}