import { UserRoutes } from '../presentation/routes/user.routes';
import { PrismaDatasource } from '../infrastructure/datasource/prisma/prisma-client';
import { CreateUserUseCase, GetUserUseCase } from '../application/usecases/user';
import { UserController } from '../presentation/controllers/user.controller';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';
import { PrismaUserDatasource } from '../infrastructure/datasource/prisma/prisma-user.datasource';
import { CreateVerificationCodeUseCase } from '../application/usecases/verification-code';
import { VerificationCodeRepositoryImpl } from '../infrastructure/repositories/verification-code.repository.impl';
import { PrismaVerificationCodeDatasource } from '../infrastructure/datasource/prisma/prisma-verification-code.datasource';
import { SendVerificationCodeEmailUseCase } from '../application/usecases/email/send-verification-code-email.use-case';
import { NodeMailerService } from '../infrastructure/services/email/nodemailer.service';
import { EnvAdapter } from '../config/plugins';

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

    const createVerificationCodeUseCase = new CreateVerificationCodeUseCase( verificationCodeRepository )

    const sendVerificationCodeEmailUseCase = new SendVerificationCodeEmailUseCase( emailService )

    const userController = new UserController(
      createUserUseCase,
      getUserUseCase, 
      createVerificationCodeUseCase,
      sendVerificationCodeEmailUseCase
    )

    this.userRoutes = new UserRoutes({ controller: userController })

  }

}