import { Router } from 'express';
import { UserRoutes } from './user.routes';

interface AppRoutesOptions {
  userRoutes: UserRoutes
}

export class AppRoutes {

  public readonly routes: Router;
  private readonly userRoutes: UserRoutes;

  constructor({ userRoutes }: AppRoutesOptions) {
    this.userRoutes = userRoutes
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()

    router.use('/api/user', this.userRoutes.routes) 

    return  router
  }

}