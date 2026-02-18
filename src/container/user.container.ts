import { UserService } from "../application/services";
import { 
  SendChangePasswordEmailUseCase, 
  SendDeactivationAccountEmailUseCase,  
  SendForgotPasswordEmailUseCase, 
  SendVerificationCodeEmailUseCase 
} from "../application/usecases/email";
import { CreateResetPassCodeUseCase, GetPasswordResetCodeUseCase } from "../application/usecases/reset-password-code";
import { DestroyImageUseCase, UploadImageUseCase } from "../application/usecases/upload";
import { 
  ChangePasswordUseCase, 
  ChangeStatusUserUseCase, 
  CheckAdminPasswordUseCase, 
  CreateUserUseCase, 
  GetAllUsersUseCase, 
  GetUserByEmailUseCase, 
  GetUserByIdUseCase, 
  ListUsersUseCase, 
  LoginUserUseCase, 
  UpdateUserImageUseCase, 
  UpdateUserUseCase, 
  UserIsValidatedUseCase, 
  ValidateUserUseCase 
} from "../application/usecases/user";
import { CreateVerificationCodeUseCase, GetVerificationCodeUseCase } from "../application/usecases/verification-code";

import { EnvAdapter } from "../config/plugins";
import { MSSQLResetPasswordCode } from "../infrastructure/datasource/ms-sql/mssql-reset-pass-code.datasource";
import { MSSQLUsers } from "../infrastructure/datasource/ms-sql/mssql-user.datasource";
import { MSSQLVerificationCode } from "../infrastructure/datasource/ms-sql/mssql-verification-code.datasource";

import { ResetPassCodeImpl, UserRepositoryImpl, VerificationCodeRepositoryImpl } from "../infrastructure/repositories";
import { CloudinaryFileUploadService, NodeMailerService } from "../infrastructure/services";

import { UserController } from "../presentation/controllers";
import { UserRoutes } from "../presentation/routes";

export class UserContainer {

  public readonly userRoutes: UserRoutes;

  constructor() {

    // Repositorios
    // const userRepositoryPrisma = new UserRepositoryImpl( new PrismaUserDatasource(PrismaDatasource.getInstance()))
    // const verificationCodeRepositoryPrisma = new VerificationCodeRepositoryImpl( new PrismaVerificationCodeDatasource( PrismaDatasource.getInstance()))
    // const resetPassCodeRepositoryPrisma = new ResetPassCodeImpl( new PrismaResetPasswordCode( PrismaDatasource.getInstance()))
    
    const userRepositoryMSSQL = new UserRepositoryImpl( new MSSQLUsers() )
    const verificationCodeRepositoryMSSQL = new VerificationCodeRepositoryImpl( new MSSQLVerificationCode() )
    const resetPassCodeRepository = new ResetPassCodeImpl( new MSSQLResetPasswordCode() )

    const emailService = new NodeMailerService({
      mailerEmail: EnvAdapter.MAILER_EMAIL,
      mailerService: EnvAdapter.MAILER_SERVICE,
      postToProvider: EnvAdapter.SEND_EMAIL,
      senderEmailPassword: EnvAdapter.MAILER_SECRET_KEY
    })

    const uploadFileService = new CloudinaryFileUploadService()

    // Casos de uso
    const changePasswordUseCase = new ChangePasswordUseCase( userRepositoryMSSQL )
    const changeStatusUserUseCase = new ChangeStatusUserUseCase( userRepositoryMSSQL )
    const checkAdminPassUseCase = new CheckAdminPasswordUseCase( userRepositoryMSSQL )
    const createUserUseCase = new CreateUserUseCase( userRepositoryMSSQL )
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepositoryMSSQL)
    const getUserByEmailUseCase = new GetUserByEmailUseCase( userRepositoryMSSQL )
    const getUserByIdUseCase = new GetUserByIdUseCase( userRepositoryMSSQL )
    const listUsersUseCase = new ListUsersUseCase( userRepositoryMSSQL )
    const loginUserUseCase = new LoginUserUseCase(userRepositoryMSSQL)
    const updateUserImageUseCase = new UpdateUserImageUseCase( userRepositoryMSSQL )
    const updateUserUseCase = new UpdateUserUseCase( userRepositoryMSSQL )
    const validateUserUseCase = new ValidateUserUseCase( userRepositoryMSSQL )
    const userIsValidatedUseCase = new UserIsValidatedUseCase( userRepositoryMSSQL )
    
    const createVerificationCodeUseCase = new CreateVerificationCodeUseCase( verificationCodeRepositoryMSSQL )
    const getVerificationCodeUseCase = new GetVerificationCodeUseCase( verificationCodeRepositoryMSSQL )

    const createResetPasswordCodeUseCase = new CreateResetPassCodeUseCase( resetPassCodeRepository )
    const getResetPassCodeUseCase = new GetPasswordResetCodeUseCase( resetPassCodeRepository )

    const sendVerificationCodeEmailUseCase = new SendVerificationCodeEmailUseCase( emailService )
    const sendDeactivationAccountUserUseCase = new SendDeactivationAccountEmailUseCase( emailService )
    const sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(emailService)
    const changePasswordEmailUseCase = new SendChangePasswordEmailUseCase(emailService)

    const uploadUserImageUseCase = new UploadImageUseCase(uploadFileService)
    const destroyUserImageUseCase = new DestroyImageUseCase(uploadFileService)

    // Servicios
    const userService = new UserService({
      changeStatusUC: changeStatusUserUseCase,
      createUserUC: createUserUseCase,
      createResetPassCodeUC: createResetPasswordCodeUseCase,
      createVerificationCodeUC: createVerificationCodeUseCase,
      getUserByIdUC: getUserByIdUseCase,
      getUserByEmailUC: getUserByEmailUseCase,
      getAllUsersUC: getAllUsersUseCase,
      getVerificationCodeUC: getVerificationCodeUseCase,
      getResetPassCodeUC: getResetPassCodeUseCase,
      loginUserUC: loginUserUseCase,
      changePasswordUserUC: changePasswordUseCase,
      listUsersUC: listUsersUseCase,
      updateUserImageUC: updateUserImageUseCase,
      checkAdminPasswordUC: checkAdminPassUseCase,
      userIsValidatedUC: userIsValidatedUseCase,
      
      updateUserUC: updateUserUseCase,
      validateUserUC: validateUserUseCase,

      sendDeactivationEmailUC: sendDeactivationAccountUserUseCase,
      sendVerificationCodeEmailUC: sendVerificationCodeEmailUseCase,
      sendForgotPasswordEmailUC: sendForgotPasswordEmailUseCase,
      sendChangePasswordEmaiUC: changePasswordEmailUseCase,

      uploadUserImageUC: uploadUserImageUseCase,
      destroyUserImageUC: destroyUserImageUseCase,
    })

    // Controlador
    const userController = new UserController(userService)

    this.userRoutes = new UserRoutes({  controller: userController })
  }

}