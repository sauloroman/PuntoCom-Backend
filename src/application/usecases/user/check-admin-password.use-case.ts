import { HashAdapter } from "../../../config/plugins";
import { UserRepository } from "../../../domain/repositories";
import { CheckAdminPasswordDtoI } from "../../dtos/user.dto";
import { ApplicationError } from "../../errors/application.error";

export class CheckAdminPasswordUseCase {

    private readonly MESSAGE_ERROR: string = "GET_USER_BY_ID_ERROR"
    private readonly MESSAGE_ERROR_PASS: string = 'INVALID_ADMIN_PASSWORD'

    constructor(private readonly userRepository: UserRepository){}

    public async execute( data: CheckAdminPasswordDtoI ): Promise<boolean> {
        const { id, adminPassword } = data

        const existingUser = await this.userRepository.findById(id)
        if ( !existingUser ) throw new ApplicationError('No se pudo obtener el usuario por id', this.MESSAGE_ERROR)

        const isCorrectPassword = HashAdapter.compare(adminPassword, existingUser.password.value )
        if ( !isCorrectPassword ) throw new ApplicationError('La contraseña no es correcta', this.MESSAGE_ERROR_PASS)

        return true
    }

}