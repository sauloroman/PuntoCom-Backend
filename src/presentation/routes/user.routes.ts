import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

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
    
    router.post('/', () => {
      console.log('Posting')
    })

    return router
  }

}