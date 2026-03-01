import { Router } from 'express';
import { RoleEnum } from '../../../generated/prisma';
import { UserController } from '../controllers';
import { 
  Auth, 
  AuthMiddleware, 
  FileUploadMiddleware, 
  ParamsHandlerMiddleware, 
  ValidateRolesMiddleware 
} from '../middlewares';

interface UserRoutesOptions {
  controller: UserController,
  auth: Auth
}

export class UserRoutes {

  public readonly routes: Router;
  private readonly controller: UserController;
  private readonly auth: Auth;

  constructor({ controller, auth }: UserRoutesOptions){
    this.controller = controller
    this.auth = auth
    this.routes = this.initRoutes()
  }

  private initRoutes(): Router {
    const router = Router()

    // ################# Public routes #################

    router.post('/login', this.controller.login )

    router.patch('/validate', [
      AuthMiddleware.isValidJWBody<{id: string}>()
    ], this.controller.validateUser )

    router.post('/forgot-password', this.controller.forgotPassword )

    router.post('/change-password', [
      AuthMiddleware.isValidJWBody<{id: string}>()
    ], this.controller.changePassword)
    
    router.post('/resend-verification-code', this.controller.resendVerificationCode )
    
    // ################# Private routes ################# 

    router.use([ this.auth.Logged ])
    
    router.post('/', [ 
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
    ], this.controller.createUser )

    router.get('/', [
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
    ], this.controller.getAllUsers )
    
    router.post('/check-admin-password', [
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador )
    ], this.controller.checkAdminPassword)

    router.get('/renew-token', this.controller.renewToken)

    router.patch('/upload-image/:id', [ 
      ParamsHandlerMiddleware.hasIDItem(),
      FileUploadMiddleware.validateContainFiles 
    ], this.controller.uploadUserImage )

    router.get('/filter', [
      ValidateRolesMiddleware.hasRole( RoleEnum.Administrador, RoleEnum.Supervisor ),
    ], this.controller.filterUsers )

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