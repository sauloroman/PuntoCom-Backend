import { UserRoutes } from '../presentation/routes/user.routes';
import { PrismaDatasource } from '../infrastructure/datasource/prisma/prisma-client';
import { CreateUserUseCase } from '../application/usecases/user/create-user.use-case';
import { UserController } from '../presentation/controllers/user.controller';
import { UserRepositoryImpl } from '../infrastructure/repositories/user-repository.impl';
import { PrismaUserDatasource } from '../infrastructure/datasource/prisma/prisma-user.datasource';

const prisma = PrismaDatasource.getInstance()

export class UserContainer {

  public readonly userRoutes: UserRoutes;

  constructor() {

    const userRepository = new UserRepositoryImpl( 
      new PrismaUserDatasource( prisma ) 
    )

    // Casos de uso
    const createUserUseCase = new CreateUserUseCase( userRepository )

    const userController = new UserController({
      createUserUseCase,
    })

    this.userRoutes = new UserRoutes({ controller: userController })

  }

}