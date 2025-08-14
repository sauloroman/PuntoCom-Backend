import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects';
import { UserDatasource } from '../../domain/datasources/user.datasource';

export class UserRepositoryImpl implements UserRepository {

  constructor( private readonly userDatasource: UserDatasource ){}

  async findById(userId: string): Promise<User | null> {
    return await this.userDatasource.findById(userId)
  }

  async findByEmail(userEmail: Email): Promise<User | null> {
    return await this.userDatasource.findByEmail(userEmail)
  }

  async findAllActive(): Promise<User[]> {
    return await this.userDatasource.findAllActive()
  }

  async findAllInactive(): Promise<User[]> {
    return await this.userDatasource.findAllInactive()
  }

  async create(user: User): Promise<User> {
    return await this.userDatasource.create( user )
  }

  async update(user: User): Promise<void> {
    return await this.userDatasource.update( user )
  }

  async deactivate(user: User): Promise<void> {
    return await this.userDatasource.deactivate(user)
  }

  async activate(user: User): Promise<void> {
    return await this.userDatasource.activate(user)
  }

}
