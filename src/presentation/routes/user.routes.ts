import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware, ParamsHandlerMiddleware } from '../middlewares';
import { UserRepository } from '../../domain/repositories/user.repository';
import { ValidateRolesMiddleware } from '../middlewares/authorization.middleware';
import { RoleEnum } from '../../../generated/prisma';

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
    router.post('/resend-verification-code', this.controller.resendVerificationCode )

    // Private routes 
    // TODO: Implement Auth Middleware

    router.post('/', [ 
      AuthMiddleware.validateLoggedUser( this.userRepository ),
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor )
    ], this.controller.createUser )

    router.get('/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      AuthMiddleware.validateLoggedUser( this.userRepository ),
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor )
    ], this.controller.getUserById )
    
    router.patch('/deactivate/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      AuthMiddleware.validateLoggedUser( this.userRepository ),
      ValidateRolesMiddleware. isAdmin(),
    ], this.controller.deactivateUser )

    router.patch('/activate/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      AuthMiddleware.validateLoggedUser( this.userRepository ),
      ValidateRolesMiddleware.isAdmin(),
    ], this.controller.activateUser )

    router.put('/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      AuthMiddleware.validateLoggedUser( this.userRepository )
    ], this.controller.updateUser )

    return router
  }

}