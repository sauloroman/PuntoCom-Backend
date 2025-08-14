import { DatesAdapter } from "../../../config/plugins";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { ChangeStatusUserRequestI, ChangeStatusUserResponsetI } from "../../dtos/user/change-status-user.dto";
import { ApplicationError } from "../../errors/application.error";

export class ChangeStatusUserUseCase {
    private readonly MESSAGE_ERROR: string = "GET_USER_ERROR"

    constructor( private readonly userRepository: UserRepository ){}

    public async execute( data: ChangeStatusUserRequestI, status: boolean ): Promise<ChangeStatusUserResponsetI> {
        const { userId } = data

        const existingUser = await this.userRepository.findById( userId )
        if (!existingUser) throw new ApplicationError(`El usuario con ${userId} no existe`, this.MESSAGE_ERROR)
        
        const user = await this.userRepository.changeStatus(userId, status)
    
        return {
            id: user.id,
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