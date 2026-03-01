import { RequestHandler } from 'express';
import { MSSQLUsers } from '../../infrastructure/datasource/ms-sql/datasources/mssql-user.datasource';
import { UserRepositoryImpl } from '../../infrastructure/repositories';
import { AuthMiddleware } from './authentication.middleware';
import { ConnectionPool } from 'mssql';

export class Auth {

  public readonly Logged: RequestHandler;

  constructor(pool: ConnectionPool) {
    this.Logged = AuthMiddleware.validateLoggedUser(
      new UserRepositoryImpl(new MSSQLUsers(pool))
    )
  }
}