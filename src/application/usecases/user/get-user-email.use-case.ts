import { DatesAdapter } from '../../../config/plugins/dates.plugin';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { Email } from '../../../domain/value-objects';
import { GetUserRequestDtoI, UserResponseDtoI } from '../../dtos/user.dto';
import { ApplicationError } from '../../errors/application.error';

export class GetUserByEmailUseCase {

  private readonly MESSAGE_ERROR: string = "GET_USER_ERROR"

  constructor(private readonly userRepository: UserRepository) { }

  public async execute(data: GetUserRequestDtoI): Promise<UserResponseDtoI> {

    const { email: userEmail } = data
    
    const user = await this.userRepository.findByEmail(new Email(userEmail!))
    if (!user) throw new ApplicationError(`El usuario con email ${userEmail} no existe`, this.MESSAGE_ERROR)

    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email.value,
      phone: user.phone.value,
      image: user.image,
      isActive: user.isActive,
      isValidated: user.isValidated,
      role: user.role.value,
      createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(user.createdAt)),
      updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(user.updatedAt))
    }

  }

}