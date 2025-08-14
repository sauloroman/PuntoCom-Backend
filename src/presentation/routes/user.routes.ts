import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { ParamsHandlerMiddleware } from '../middlewares/params-handler.middleware';

interface UserRoutesOptions {
  controller: UserController
}

export class UserRoutes {

  public readonly routes: Router;
  private readonly controller: UserController;

  constructor({ controller }: UserRoutesOptions){
    this.controller = controller
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()
    
    router.post('/', this.controller.createUser )

    router.get('/:id', [ParamsHandlerMiddleware.hasIDItem()], this.controller.getUserById )

    return router
  }

}