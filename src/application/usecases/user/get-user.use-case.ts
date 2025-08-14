import { DatesAdapter } from '../../../config/plugins/dates.plugin';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { GetUserByIdRequestDtoI, UserResponseDtoI } from '../../dtos/user.dto';
import { ApplicationError } from '../../errors/application.error';

export class GetUserUseCase {

  private readonly MESSAGE_ERROR: string = "GET_USER_ERROR"

  constructor(private readonly userRepository: UserRepository) { }

  public async execute(data: GetUserByIdRequestDtoI): Promise<UserResponseDtoI> {

    const { id: userId } = data
    const user = await this.userRepository.findById(userId)
    if (!user) throw new ApplicationError(`El usuario con ${userId} no existe`, this.MESSAGE_ERROR)

    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email.value,
      image: user.image,
      isActive: user.isActive,
      isValidated: user.isValidated,
      role: user.role.value,
      createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(user.createdAt)),
      updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(user.updatedAt))
    }

  }

}