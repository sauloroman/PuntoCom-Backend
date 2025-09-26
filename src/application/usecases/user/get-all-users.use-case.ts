import { DatesAdapter } from "../../../config/plugins";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserResponseDtoI } from "../../dtos/user.dto";

export class GetAllUsersUseCase {

    constructor(private readonly userRepository: UserRepository){}

    public async execute(): Promise<UserResponseDtoI[]> {
        const users = await this.userRepository.getAllUsers()
        return users.map( user => ({
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
        }))
    }

}