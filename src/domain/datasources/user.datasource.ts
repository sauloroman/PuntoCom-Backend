import { PaginationDTO, PaginationResponseDto } from '../../application/dtos/pagination.dto';
import { User } from '../entities';
import { Email } from '../value-objects/Email';

export abstract class UserDatasource {
  abstract findById( userId: string ): Promise<User | null>
  abstract findByEmail( userEmail: Email ): Promise<User | null>
  abstract create( user: User ): Promise<User>
  abstract update( user: User ): Promise<User>
  abstract changeStatus( userId: string, status: boolean ): Promise<User>
  abstract getUsers( pagination: PaginationDTO ): Promise<PaginationResponseDto<User>>
}