import { DatesAdapter } from "../../../config/plugins";
import { User } from "../../../domain/entities";
import { UserRepository } from "../../../domain/repositories";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { UserResponseDtoI } from "../../dtos/user.dto";

export class ListUsersUseCase {

    constructor( private readonly userRepository: UserRepository ){}

    public async execute( pagination: PaginationDTO ): Promise<PaginationResponseDto<UserResponseDtoI>> {
        const {items, page, total, totalPages} = await this.userRepository.getUsers( pagination )

        const users = items.map( (user: User): UserResponseDtoI => {
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
        })

        return {
            items: users,
            page: page,
            total: total,
            totalPages: totalPages
        }
    }

}