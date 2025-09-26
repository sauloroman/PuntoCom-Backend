import { DatesAdapter } from "../../../config/plugins";
import { User } from "../../../domain/entities";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email, Password, Phone, Role } from "../../../domain/value-objects";
import { UpdateUserRequestDTOI, UserResponseDtoI } from "../../dtos/user.dto";
import { ApplicationError } from "../../errors/application.error";

export class UpdateUserUseCase {

    private readonly MESSAGE_ERROR: string = "UPDATE_USER_ERROR"

    constructor( private readonly userRepository: UserRepository ){}

    public async execute( data: UpdateUserRequestDTOI ): Promise<UserResponseDtoI> {

        const { id, lastname, name, role, phone } = data

        const existingUser = await this.userRepository.findById( id )
        if (!existingUser) throw new ApplicationError(`El usuario con id ${id} no existe`, this.MESSAGE_ERROR)

        const user = new User({
            id: existingUser.id,
            email: new Email( existingUser.email.value ),
            isActive: existingUser.isActive,
            isValidated: existingUser.isValidated,
            lastname: lastname ? lastname : existingUser.lastname,
            name: name ? name: existingUser.name,
            phone: phone ? new Phone(phone) : existingUser.phone,
            password: new Password(existingUser.password.value),
            role: role ? new Role( role ): new Role( existingUser.role.value ),
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
            phone: updatedUser.phone.value,
            role: updatedUser.role.value,
            image: updatedUser.image,
            isActive: updatedUser.isActive,
            isValidated: updatedUser.isValidated,
            createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(updatedUser.createdAt)),
            updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(updatedUser.updatedAt))
        }
    }

}