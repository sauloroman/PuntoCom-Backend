import { PrismaDatasource } from '../../infrastructure/datasource/prisma/prisma-client';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user.repository.impl';
import { PrismaUserDatasource } from '../../infrastructure/datasource/prisma/prisma-user.datasource';
import { AuthMiddleware } from './authentication.middleware';

const prisma = PrismaDatasource.getInstance();

export const Auth = {
  Logged: AuthMiddleware.validateLoggedUser(
    new UserRepositoryImpl(
      new PrismaUserDatasource(prisma)
    )
  )
}
