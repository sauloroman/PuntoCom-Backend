import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware, ParamsHandlerMiddleware } from '../middlewares';
import { UserRepository } from '../../domain/repositories/user.repository';

interface UserRoutesOptions {
  controller: UserController,
  userRepository: UserRepository
}

export class UserRoutes {

  public readonly routes: Router;
  public readonly userRepository: UserRepository
  private readonly controller: UserController;

  constructor({ controller, userRepository }: UserRoutesOptions){
    this.controller = controller
    this.userRepository =  userRepository
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()

    // Public routes

    router.post('/login', this.controller.login )
    router.patch('/validate', [AuthMiddleware.isValidJWBody<{id: string}>()], this.controller.validateUser )
    router.post('/forgot-password', this.controller.forgotPassword )
    router.post('/change-password', [AuthMiddleware.isValidJWBody<{id: string}>()], this.controller.changePassword)

    // Private routes 
    // TODO: Implement Auth Middleware

    router.post('/', [ // The only user role who can create a new user is an administrator
      AuthMiddleware.validateLoggedUser( this.userRepository )
    ], this.controller.createUser )

    router.get('/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      AuthMiddleware.validateLoggedUser( this.userRepository )
    ], this.controller.getUserById )
    
    router.patch('/deactivate/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      AuthMiddleware.validateLoggedUser( this.userRepository )
    ], this.controller.deactivateUser )

    router.patch('/activate/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      AuthMiddleware.validateLoggedUser( this.userRepository )
    ], this.controller.activateUser )

    router.put('/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      AuthMiddleware.validateLoggedUser( this.userRepository )
    ], this.controller.updateUser )

    return router
  }

}