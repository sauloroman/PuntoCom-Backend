import { DatesAdapter } from "../../../config/plugins";
import { User } from "../../../domain/entities";
import { UserRepository } from "../../../domain/repositories";
import { Email, Password, Phone, Role } from "../../../domain/value-objects";
import { UserResponseDtoI, ValidateUserI } from "../../dtos/user.dto";
import { ApplicationError } from "../../errors/application.error";

export class ValidateUserUseCase {
    private readonly MESSAGE_ERROR: string = "VALIDATE_USER_ERROR"

    constructor(private readonly userRepository: UserRepository) { }

    public async execute( data: ValidateUserI ): Promise<UserResponseDtoI> {
        const { userId } = data

        const exitingUser = await this.userRepository.findById( userId )
        if (!exitingUser) throw new ApplicationError(`El usuario con ${userId} no existe`, this.MESSAGE_ERROR)
        if ( exitingUser.isValidated ) throw new ApplicationError(`La cuenta ya está autenticada`)

        const user = new User({
            id: exitingUser.id,
            email: new Email( exitingUser.email.value ),
            isActive: exitingUser.isActive,
            isValidated: true,
            lastname: exitingUser.lastname,
            name: exitingUser.name,
            password: new Password(exitingUser.password.value),
            phone: new Phone(exitingUser.phone.value) ?? '',
            role: new Role(exitingUser.role.value),
            createdAt: exitingUser.createdAt,
            updatedAt: DatesAdapter.now()
        })

        const updatedUser = await this.userRepository.update(user)

        return {
            id: updatedUser.id,
            name: updatedUser.name,
            lastname: updatedUser.lastname,
            email: updatedUser.email.value,
            phone: user.phone.value,
            role: updatedUser.role.value,
            image: updatedUser.image,
            isActive: updatedUser.isActive,
            isValidated: updatedUser.isValidated,
            createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(updatedUser.createdAt)),
            updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(updatedUser.createdAt))
        }

    }

}