import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware, MapperFilterMiddleware, ParamsHandlerMiddleware, ValidateRolesMiddleware } from '../middlewares';
import { RoleEnum } from '../../../generated/prisma';
import { Auth } from '../middlewares/auth';

interface UserRoutesOptions {
  controller: UserController,
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

    // Public routes

    router.post('/login', this.controller.login )
    router.patch('/validate', [AuthMiddleware.isValidJWBody<{id: string}>()], this.controller.validateUser )
    router.post('/forgot-password', this.controller.forgotPassword )
    router.post('/change-password', [AuthMiddleware.isValidJWBody<{id: string}>()], this.controller.changePassword)
    router.post('/resend-verification-code', this.controller.resendVerificationCode )

    // Private routes 
    // TODO: Implement Auth Middleware

    router.use([ Auth.Logged ])

    router.get('/', [
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
      MapperFilterMiddleware.ToPrisma()
    ], this.controller.getUsers )

    router.get('/search', [
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
      MapperFilterMiddleware.ToPrismaContains()
    ], this.controller.getUsers )

    router.post('/', [ 
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor )
    ], this.controller.createUser )

    router.get('/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor )
    ], this.controller.getUserById )
    
    router.patch('/deactivate/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
       ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
      ], this.controller.deactivateUser )
      
    router.patch('/activate/:id', [
        ParamsHandlerMiddleware.hasIDItem(),
        ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
    ], this.controller.activateUser )

    router.put('/:id', [
      ParamsHandlerMiddleware.hasIDItem(),
    ], this.controller.updateUser )

    return router
  }

}