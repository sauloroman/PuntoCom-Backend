import { DatesAdapter, HashAdapter } from "../../../config/plugins";
import { User } from "../../../domain/entities";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email, Password, Role } from "../../../domain/value-objects";
import { ChangePasswordRequestI, UserResponseDtoI } from "../../dtos/user.dto";
import { ApplicationError } from "../../errors/application.error";

export class ChangePasswordUseCase {

    private readonly MESSAGE_ERROR: string = "CHANGE_PASSWORD_USER_ERROR"

    constructor(private readonly userRepository: UserRepository){}

    public async execute( data: ChangePasswordRequestI ): Promise<UserResponseDtoI> {
        const { id: userId, newPassword } = data

        const existingUser = await this.userRepository.findById(userId!)
        if (!existingUser) throw new ApplicationError(`El usuario con id ${userId} no existe`, this.MESSAGE_ERROR)

        const hashedPassword = HashAdapter.hash( newPassword )

        const user = new User({
            id: existingUser.id,
            email: new Email( existingUser.email.value ),
            isActive: existingUser.isActive,
            isValidated: existingUser.isValidated,
            lastname: existingUser.lastname,
            name: existingUser.name,
            password: new Password(hashedPassword),
            role: new Role( existingUser.role.value ),
            image: existingUser.image,
            createdAt: DatesAdapter.toLocal(existingUser.createdAt),
            updatedAt: DatesAdapter.toLocal(DatesAdapter.now())
        })

        const updatedUser = await this.userRepository.update( user )

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
            updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(updatedUser.updatedAt))
        }
    }

}