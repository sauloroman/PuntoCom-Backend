import { UserRoutes } from '../presentation/routes/user.routes';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma/prisma-user-repository';
import { PrismaSingleton } from '../infrastructure/database/prisma/prisma-client';
import { CreateUserUseCase } from '../application/usecases/user/create-user.use-case';
import { UserController } from '../presentation/controllers/user.controller';

const prisma = PrismaSingleton.getInstance()

export class UserContainer {

  public readonly userRoutes: UserRoutes;

  constructor() {

    const userRepository = new PrismaUserRepository( prisma );

    // Casos de uso
    const createUserUseCase = new CreateUserUseCase( userRepository )

    const userController = new UserController({
      createUserUseCase,
    })

    this.userRoutes = new UserRoutes({ controller: userController })

  }

}