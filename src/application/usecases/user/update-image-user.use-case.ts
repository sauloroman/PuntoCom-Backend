import { DatesAdapter } from "../../../config/plugins";
import { User } from "../../../domain/entities";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email, Password, Role } from "../../../domain/value-objects";
import { UpdateUserImageDto, UserResponseDtoI } from "../../dtos/user.dto";

export class UpdateUserImageUseCase {

    constructor(private readonly userRepository: UserRepository){}

    public async execute( data: UpdateUserImageDto ): Promise<UserResponseDtoI | null> {

        const { id, url } = data

        const existingUser = await this.userRepository.findById( id )
        if ( !existingUser ) return null

        const user = new User({
            id: existingUser.id,
            email: new Email( existingUser.email.value ),
            isActive: existingUser.isActive,
            isValidated: existingUser.isValidated,
            lastname: existingUser.lastname,
            name: existingUser.name,
            password: new Password(existingUser.password.value),
            role: new Role( existingUser.role.value ),
            image: url,
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