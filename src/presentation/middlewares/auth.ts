import { MSSQLUsers } from '../../infrastructure/datasource/ms-sql/mssql-user.datasource';
// import { PrismaDatasource, PrismaUserDatasource } from '../../infrastructure/datasource/prisma';
import { UserRepositoryImpl } from '../../infrastructure/repositories';
import { AuthMiddleware } from './authentication.middleware';

// const prisma = PrismaDatasource.getInstance();

export const Auth = {
  Logged: AuthMiddleware.validateLoggedUser(
    // new UserRepositoryImpl( new PrismaUserDatasource(prisma) )
    new UserRepositoryImpl( new MSSQLUsers() )
  )
}
