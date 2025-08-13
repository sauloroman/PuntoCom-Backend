import { HashAdapter, DatesAdapter, IDAdapter } from '../../../config/plugins';

import { UserRepository } from '../../../domain/repositories/user.repository';
import { Email, Password, Role } from '../../../domain/value-objects';
import { User } from '../../../domain/entities';

import { HttpError } from '../../../presentation/error/http.error';
import { BadRequestError, InternalServerError } from '../../../presentation/error';

import { CreateUserRequestDtoI, CreateUserResponseDtoI } from '../../dtos/user/create-user.dto';

export class CreateUserUseCase {

  constructor( private readonly userRepository: UserRepository ){}

  public async execute( data: CreateUserRequestDtoI ): Promise<CreateUserResponseDtoI> {
    
    try {

      const existingUser = await this.userRepository.findByEmail(new Email(data.email))
      if ( existingUser ) throw new BadRequestError(`El email ${data.email} ya está registrado`) 
      
      const hashedPassword = HashAdapter.hash(data.password)

      const user = new User({
        id: IDAdapter.generate(),
        name: data.name,
        lastname: data.lastname,
        email: new Email(data.email), 
        password: new Password(hashedPassword),
        role: new Role(data.role),
        image: undefined,
        isActive: true,
        createdAt: DatesAdapter.now(),
        updatedAt: DatesAdapter.now()
      })
      
      await this.userRepository.create( user )

      return {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email.value,
        role: user.role.value,
        image: user.image,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

    } catch( error ) {
      if ( error instanceof HttpError ) throw error
      throw new InternalServerError( error instanceof Error ? error.message : 'Error inesperado al crear usuario')
    }
   
  }


}