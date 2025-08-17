import { Router } from 'express';
import { UserRoutes, CategoryRoutes } from './';
import { ErrorHandlerMiddleware } from '../middlewares/error-handler.middleware';

interface AppRoutesOptions {
  userRoutes: UserRoutes,
  categoryRoutes: CategoryRoutes
}

export class AppRoutes {

  public readonly routes: Router;
  private readonly userRoutes: UserRoutes;
  private readonly categoryRoutes: CategoryRoutes

  constructor({ userRoutes, categoryRoutes }: AppRoutesOptions) {
    this.userRoutes = userRoutes
    this.categoryRoutes = categoryRoutes
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()

    router.use('/api/user', this.userRoutes.routes) 
    router.use('/api/category', this.categoryRoutes.routes)

    router.use( ErrorHandlerMiddleware.getHandler() )
    
    return  router
  }

}