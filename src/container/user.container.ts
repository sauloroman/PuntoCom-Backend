import { UserRoutes } from '../presentation/routes/user.routes';
import { PrismaDatasource } from '../infrastructure/datasource/prisma/prisma-client';
import { ChangeStatusUserUseCase, CreateUserUseCase, GetUserUseCase } from '../application/usecases/user';
import { SendVerificationCodeEmailUseCase, SendDeactivationAccountEmailUseCase } from '../application/usecases/email';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';
import { PrismaUserDatasource } from '../infrastructure/datasource/prisma/prisma-user.datasource';
import { CreateVerificationCodeUseCase, GetVerificationCodeUseCase } from '../application/usecases/verification-code';
import { VerificationCodeRepositoryImpl } from '../infrastructure/repositories/verification-code.repository.impl';
import { PrismaVerificationCodeDatasource } from '../infrastructure/datasource/prisma/prisma-verification-code.datasource';
import { NodeMailerService } from '../infrastructure/services/email/nodemailer.service';
import { UserController } from '../presentation/controllers/user.controller';
import { EnvAdapter } from '../config/plugins';
import { ValidateUserUseCase } from '../application/usecases/user/validate-user.use-case';

const prisma = PrismaDatasource.getInstance()

export class UserContainer {

  public readonly userRoutes: UserRoutes;

  constructor() {

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
    const createUserUseCase = new CreateUserUseCase( userRepository )
    const getUserUseCase = new GetUserUseCase( userRepository )
    const changeStatusUserUseCase = new ChangeStatusUserUseCase( userRepository )
    const validateUserUseCase = new ValidateUserUseCase( userRepository )

    const createVerificationCodeUseCase = new CreateVerificationCodeUseCase( verificationCodeRepository )
    const getVerificationCodeUseCase = new GetVerificationCodeUseCase( verificationCodeRepository )

    const sendVerificationCodeEmailUseCase = new SendVerificationCodeEmailUseCase( emailService )
    const sendDeactivationAccountUserUseCase = new SendDeactivationAccountEmailUseCase( emailService )

    const userController = new UserController({
      changeStatusUseCase: changeStatusUserUseCase,
      createUserUseCase: createUserUseCase,
      createVerificationCodeUseCase: createVerificationCodeUseCase,
      getUserUseCase: getUserUseCase,
      getVerificationCodeUseCase: getVerificationCodeUseCase,
      sendDeactivationAccountEmailUseCase: sendDeactivationAccountUserUseCase,
      sendVerificationCodeEmailUseCase: sendVerificationCodeEmailUseCase,
      validateUserUseCase: validateUserUseCase,
    })

    this.userRoutes = new UserRoutes({ controller: userController })

  }

}