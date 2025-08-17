import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects';
import { UserDatasource } from '../../domain/datasources/user.datasource';
import { PaginationDTO, PaginationResponseDto } from '../../application/dtos/pagination.dto';

export class UserRepositoryImpl implements UserRepository {

  constructor( private readonly userDatasource: UserDatasource ){}
  
  async getUsers(pagination: PaginationDTO): Promise<PaginationResponseDto<User>> {
    return await this.userDatasource.getUsers( pagination )
  }

  async findById(userId: string): Promise<User | null> {
    return await this.userDatasource.findById(userId)
  }

  async findByEmail(userEmail: Email): Promise<User | null> {
    return await this.userDatasource.findByEmail(userEmail)
  }

  async create(user: User): Promise<User> {
    return await this.userDatasource.create( user )
  }

  async update(user: User): Promise<User> {
    return await this.userDatasource.update( user )
  }

  async changeStatus(userId: string, status: boolean): Promise<User> {
    return await this.userDatasource.changeStatus(userId, status)
  }

}
