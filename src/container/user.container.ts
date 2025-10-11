import { EnvAdapter } from '../config/plugins';

import { UserService } from '../application/services';
import { ValidateUserUseCase } from '../application/usecases/user/validate-user.use-case';
import { ChangePasswordUseCase, ChangeStatusUserUseCase, CheckAdminPasswordUseCase, CreateUserUseCase, GetAllUsersUseCase, GetUserByEmailUseCase, GetUserByIdUseCase, ListUsersUseCase, LoginUserUseCase, UpdateUserImageUseCase } from '../application/usecases/user';
import { SendVerificationCodeEmailUseCase, SendDeactivationAccountEmailUseCase, SendForgotPasswordEmailUseCase, SendChangePasswordEmailUseCase, SendVerificationCodeEmailMobileUseCase, SendForgotPasswordEmailMobileUseCase } from '../application/usecases/email';
import { CreateVerificationCodeUseCase, GetVerificationCodeUseCase } from '../application/usecases/verification-code';
import { DestroyImageUseCase, UploadImageUseCase } from '../application/usecases/upload';

import { PrismaDatasource } from '../infrastructure/datasource/prisma/prisma-client';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';
import { PrismaUserDatasource } from '../infrastructure/datasource/prisma/prisma-user.datasource';
import { VerificationCodeRepositoryImpl } from '../infrastructure/repositories/verification-code.repository.impl';
import { PrismaVerificationCodeDatasource } from '../infrastructure/datasource/prisma/prisma-verification-code.datasource';
import { NodeMailerService } from '../infrastructure/services/email/nodemailer.service';
import { CloudinaryFileUploadService } from '../infrastructure/services/file-upload/cloudinary.service';

import { UserRoutes } from '../presentation/routes/user.routes';
import { UserController } from '../presentation/controllers/user.controller';
import { UpdateUserUseCase } from '../application/usecases/user/update-user.use-case';
import { PuppeteerPdfService } from '../infrastructure/services/pdf/puppeteer.service';
import { LocalFileUploadService } from '../infrastructure/services/file-upload/local.service';
import { CreateResetPassCodeUseCase, GetPasswordResetCodeUseCase } from '../application/usecases/reset-password-code';
import { ResetPassCodeImpl } from '../infrastructure/repositories/reset-pass-code.repository.impl';
import { PrismaResetPasswordCode } from '../infrastructure/datasource/prisma/prisma-reset-pass-code.datasource';

export class UserContainer {

  public readonly userRoutes: UserRoutes;

  constructor() {

    // Repositorios
    const userRepository = new UserRepositoryImpl( 
      new PrismaUserDatasource( PrismaDatasource.getInstance() ) 
    )

    const verificationCodeRepository = new VerificationCodeRepositoryImpl(
      new PrismaVerificationCodeDatasource( PrismaDatasource.getInstance() )
    )

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
    const uploadPdfService = new LocalFileUploadService()
    const pdfService = new PuppeteerPdfService() 

    // Casos de uso
    const loginUserUseCase = new LoginUserUseCase(userRepository)
    const createUserUseCase = new CreateUserUseCase( userRepository )
    const getUserByIdUseCase = new GetUserByIdUseCase( userRepository )
    const getUserByEmailUseCase = new GetUserByEmailUseCase( userRepository )
    const changeStatusUserUseCase = new ChangeStatusUserUseCase( userRepository )
    const validateUserUseCase = new ValidateUserUseCase( userRepository )
    const updateUserUseCase = new UpdateUserUseCase( userRepository )
    const changePasswordUseCase = new ChangePasswordUseCase( userRepository )
    const listUsersUseCase = new ListUsersUseCase( userRepository )
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)
    const updateUserImageUseCase = new UpdateUserImageUseCase( userRepository )
    const checkAdminPassUseCase = new CheckAdminPasswordUseCase( userRepository )

    const createResetPasswordCodeUseCase = new CreateResetPassCodeUseCase( resetPassCodeRepository )
    const getResetPassCodeUseCase = new GetPasswordResetCodeUseCase( resetPassCodeRepository )
    const createVerificationCodeUseCase = new CreateVerificationCodeUseCase( verificationCodeRepository )
    const getVerificationCodeUseCase = new GetVerificationCodeUseCase( verificationCodeRepository )

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