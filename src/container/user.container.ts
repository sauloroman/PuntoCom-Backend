import { UserService } from "../application/services";
import { 
  SendChangePasswordEmailUseCase, 
  SendDeactivationAccountEmailUseCase, 
  SendForgotPasswordEmailMobileUseCase, 
  SendForgotPasswordEmailUseCase, 
  SendVerificationCodeEmailMobileUseCase, 
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
import { MSSQLUsers } from "../infrastructure/datasource/ms-sql/mssql-user.datasource";
import { MSSQLVerificationCode } from "../infrastructure/datasource/ms-sql/mssql-verification-code.datasource";

import { 
  PrismaDatasource, 
  PrismaResetPasswordCode, 
  PrismaUserDatasource, 
  PrismaVerificationCodeDatasource 
} from "../infrastructure/datasource/prisma";
import { ResetPassCodeImpl, UserRepositoryImpl, VerificationCodeRepositoryImpl } from "../infrastructure/repositories";
import { CloudinaryFileUploadService, NodeMailerService } from "../infrastructure/services";

import { UserController } from "../presentation/controllers";
import { UserRoutes } from "../presentation/routes";

export class UserContainer {

  public readonly userRoutes: UserRoutes;

  constructor() {

    // Repositorios
    const userRepositoryPrisma = new UserRepositoryImpl( new PrismaUserDatasource(PrismaDatasource.getInstance()))
    const verificationCodeRepository = new VerificationCodeRepositoryImpl( new PrismaVerificationCodeDatasource( PrismaDatasource.getInstance()))
    
    const userRepositoryMSSQL = new UserRepositoryImpl( new MSSQLUsers() )
    const verificationCodeRepositoryMSSQL = new VerificationCodeRepositoryImpl( new MSSQLVerificationCode() )

    const resetPassCodeRepository = new ResetPassCodeImpl(
      new PrismaResetPasswordCode( PrismaDatasource.getInstance() )
    )

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
    
    // const changePasswordUseCase = new ChangePasswordUseCase( userRepositoryPrisma )
    // const changeStatusUserUseCase = new ChangeStatusUserUseCase( userRepositoryPrisma )
    // const checkAdminPassUseCase = new CheckAdminPasswordUseCase( userRepositoryPrisma )
    // const createUserUseCase = new CreateUserUseCase( userRepositoryPrisma )
    // const getAllUsersUseCase = new GetAllUsersUseCase(userRepositoryPrisma)
    // const getUserByEmailUseCase = new GetUserByEmailUseCase( userRepositoryPrisma )
    // const getUserByIdUseCase = new GetUserByIdUseCase( userRepositoryPrisma )
    // const listUsersUseCase = new ListUsersUseCase( userRepositoryPrisma )
    // const loginUserUseCase = new LoginUserUseCase(userRepositoryPrisma)
    // const updateUserImageUseCase = new UpdateUserImageUseCase( userRepositoryPrisma )
    // const updateUserUseCase = new UpdateUserUseCase( userRepositoryPrisma )
    // const validateUserUseCase = new ValidateUserUseCase( userRepositoryPrisma )

    const createResetPasswordCodeUseCase = new CreateResetPassCodeUseCase( resetPassCodeRepository )
    const getResetPassCodeUseCase = new GetPasswordResetCodeUseCase( resetPassCodeRepository )
    // const createVerificationCodeUseCase = new CreateVerificationCodeUseCase( verificationCodeRepository )
    // const getVerificationCodeUseCase = new GetVerificationCodeUseCase( verificationCodeRepository )

    const sendVerificationCodeEmailUseCase = new SendVerificationCodeEmailUseCase( emailService )
    const sendVerificationCodeEmailMobileUseCase = new SendVerificationCodeEmailMobileUseCase(emailService)
    const sendDeactivationAccountUserUseCase = new SendDeactivationAccountEmailUseCase( emailService )
    const sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(emailService)
    const sendForgotPasswordEmailMobileUseCase = new SendForgotPasswordEmailMobileUseCase(emailService)
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
      sendVerificationCodeEmailMobileUC: sendVerificationCodeEmailMobileUseCase,
      sendVerificationCodeEmailUC: sendVerificationCodeEmailUseCase,
      sendForgotPasswordEmailUC: sendForgotPasswordEmailUseCase,
      sendForgotPasswordEmaiMobileUC: sendForgotPasswordEmailMobileUseCase,
      sendChangePasswordEmaiUC: changePasswordEmailUseCase,

      uploadUserImageUC: uploadUserImageUseCase,
      destroyUserImageUC: destroyUserImageUseCase,
    })

    // Controlador
    const userController = new UserController(userService)

    this.userRoutes = new UserRoutes({ 
      controller: userController
    })

  }

}