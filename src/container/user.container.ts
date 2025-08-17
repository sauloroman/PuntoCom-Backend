import { EnvAdapter } from '../config/plugins';

import { UserService } from '../application/services';
import { ValidateUserUseCase } from '../application/usecases/user/validate-user.use-case';
import { ChangePasswordUseCase, ChangeStatusUserUseCase, CreateUserUseCase, GetUserByEmailUseCase, GetUserByIdUseCase, ListUsersUseCase, LoginUserUseCase } from '../application/usecases/user';
import { SendVerificationCodeEmailUseCase, SendDeactivationAccountEmailUseCase, SendForgotPasswordEmailUseCase, SendChangePasswordEmailUseCase } from '../application/usecases/email';
import { CreateVerificationCodeUseCase, GetVerificationCodeUseCase } from '../application/usecases/verification-code';

import { PrismaDatasource } from '../infrastructure/datasource/prisma/prisma-client';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';
import { PrismaUserDatasource } from '../infrastructure/datasource/prisma/prisma-user.datasource';
import { VerificationCodeRepositoryImpl } from '../infrastructure/repositories/verification-code.repository.impl';
import { PrismaVerificationCodeDatasource } from '../infrastructure/datasource/prisma/prisma-verification-code.datasource';
import { NodeMailerService } from '../infrastructure/services/email/nodemailer.service';

import { UserRoutes } from '../presentation/routes/user.routes';
import { UserController } from '../presentation/controllers/user.controller';
import { UpdateUserUseCase } from '../application/usecases/user/update-user.use-case';

const prisma = PrismaDatasource.getInstance()

export class UserContainer {

  public readonly userRoutes: UserRoutes;

  constructor() {

    // Repositorios
    const userRepository = new UserRepositoryImpl( 
      new PrismaUserDatasource( prisma ) 
    )

    const verificationCodeRepository = new VerificationCodeRepositoryImpl(
      new PrismaVerificationCodeDatasource( prisma )
    )
    const emailService = new NodeMailerService({
      mailerEmail: EnvAdapter.MAILER_EMAIL,
      mailerService: EnvAdapter.MAILER_SERVICE,
      postToProvider: EnvAdapter.SEND_EMAIL,
      senderEmailPassword: EnvAdapter.MAILER_SECRET_KEY
    })

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

    const createVerificationCodeUseCase = new CreateVerificationCodeUseCase( verificationCodeRepository )
    const getVerificationCodeUseCase = new GetVerificationCodeUseCase( verificationCodeRepository )

    const sendVerificationCodeEmailUseCase = new SendVerificationCodeEmailUseCase( emailService )
    const sendDeactivationAccountUserUseCase = new SendDeactivationAccountEmailUseCase( emailService )
    const sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(emailService)
    const changePasswordEmailUseCase = new SendChangePasswordEmailUseCase(emailService)

    // Servicios
    const userService = new UserService({
      changeStatusUC: changeStatusUserUseCase,
      createUserUC: createUserUseCase,
      createVerificationCodeUC: createVerificationCodeUseCase,
      getUserByIdUC: getUserByIdUseCase,
      getUserByEmailUC: getUserByEmailUseCase,
      getVerificationCodeUC: getVerificationCodeUseCase,
      loginUserUC: loginUserUseCase,
      changePasswordUserUC: changePasswordUseCase,
      listUsersUC: listUsersUseCase,
      
      updateUserUC: updateUserUseCase,
      validateUserUC: validateUserUseCase,

      sendDeactivationEmailUC: sendDeactivationAccountUserUseCase,
      sendVerificationCodeEmailUC: sendVerificationCodeEmailUseCase,
      sendForgotPasswordEmailUC: sendForgotPasswordEmailUseCase,
      sendChangePasswordEmaiUC: changePasswordEmailUseCase,
    })

    // Controlador
    const userController = new UserController(userService)

    this.userRoutes = new UserRoutes({ 
      controller: userController,
      userRepository: userRepository, 
    })

  }

}