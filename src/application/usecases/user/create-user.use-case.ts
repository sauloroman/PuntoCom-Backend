import { HashAdapter, DatesAdapter } from '../../../config/plugins';

import { UserRepository } from '../../../domain/repositories/user.repository';
import { Email, Password, Role } from '../../../domain/value-objects';
import { User } from '../../../domain/entities';

import { ApplicationError } from '../../errors/application.error';
import { CreateUserRequestDtoI, UserResponseDtoI } from '../../dtos/user.dto';

export class CreateUserUseCase {

  private readonly MESSAGE_ERROR: string = "CREATE_USER_ERROR"

  constructor( private readonly userRepository: UserRepository ) { }

  public async execute(data: CreateUserRequestDtoI): Promise<UserResponseDtoI> {

    const existingUser = await this.userRepository.findByEmail(new Email(data.email))
    if (existingUser) throw new ApplicationError(`El email ${data.email} ya está registrado`, this.MESSAGE_ERROR)

    const hashedPassword = HashAdapter.hash(data.password)

    const user = new User({
      name: data.name,
      lastname: data.lastname,
      email: new Email(data.email),
      password: new Password(hashedPassword),
      role: new Role(data.role),
      image: undefined,
      isActive: true,
      isValidated: false,
      createdAt: DatesAdapter.now(),
      updatedAt: DatesAdapter.now()
    })

    const createdUser = await this.userRepository.create(user)

    return {
      id: createdUser.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email.value,
      role: user.role.value,
      image: user.image,
      isActive: user.isActive,
      isValidated: user.isValidated,
      createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(user.createdAt)),
      updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(user.createdAt))
    }

  }


}