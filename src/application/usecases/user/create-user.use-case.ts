import { UserRepository } from '../../../domain/repositories/user-repository';
import { Email, Password, Role } from '../../../domain/value-objects';
import { User } from '../../../domain/entities';

import { CreateUserRequestDto, CreateUserResponseDto } from '../../dtos/user/create-user.dto';

import { BcryptAdapter } from '../../../config/plugins/crypt.plugin';
import { IDAdapter } from '../../../config/plugins/id.plugin';

export class CreateUserUseCase {

  constructor(private readonly userRepository: UserRepository){}

  public async execute( data: CreateUserRequestDto ): Promise<CreateUserResponseDto> {
    
    const existingUser = await this.userRepository.findByEmail(new Email(data.email))
    if ( existingUser ) throw new Error('El email ya está registrado') 
    
    const hashedPassword = BcryptAdapter.hash(data.password)

    const user = new User({
      id: IDAdapter.generate(),
      name: data.name,
      lastname: data.lastname,
      email: new Email(data.email),
      password: new Password(hashedPassword),
      role: new Role(data.role),
      image: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    await this.userRepository.create( user )

    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email.value,
      role: user.role.value,
      image: user.image,
      createdAt: user.createdAt
    }

  }


}