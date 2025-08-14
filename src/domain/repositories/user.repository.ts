import { User } from "../entities";
import { Email } from '../value-objects';

export abstract class UserRepository {
  abstract findById( userId: string ): Promise<User | null>
  abstract findByEmail( userEmail: Email ): Promise<User | null>
  abstract findAllActive(): Promise<User[]>
  abstract findAllInactive(): Promise<User[]>
  abstract create( user: User ): Promise<User>
  abstract update( user: User ): Promise<void>
  abstract deactivate( user: User ): Promise<void>
  abstract activate( user: User ): Promise<void>
}