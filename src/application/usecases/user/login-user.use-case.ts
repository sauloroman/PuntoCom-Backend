import { DatesAdapter, HashAdapter } from "../../../config/plugins";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value-objects";
import { LoginUserRequestI, UserResponseDtoI } from "../../dtos/user.dto";
import { ApplicationError } from "../../errors/application.error";

export class LoginUserUseCase {

    private readonly MESSAGE_ERROR: string = "LOGIN_USER_ERROR"
    
    constructor( private readonly userRepository: UserRepository ){}

    public async execute( data: LoginUserRequestI ): Promise<UserResponseDtoI> {

        const { email, password } = data

        const user = await this.userRepository.findByEmail(new Email(email))
        if ( !user ) throw new ApplicationError('Credenciales Incorrectas', this.MESSAGE_ERROR)

        if ( !user.isValidated ) throw new ApplicationError('Debes validar tu cuenta primero', this.MESSAGE_ERROR )
        
        if ( !user.isActive ) throw new ApplicationError('Tu cuenta ha sido desactivada. Contacta con el administrador', this.MESSAGE_ERROR )

        const isCorrectPassword = HashAdapter.compare( password, user.password.value )
        if ( !isCorrectPassword ) throw new ApplicationError('Credenciales Incorrectas', this.MESSAGE_ERROR)
        
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email.value,
            phone: user.phone.value,
            role: user.role.value,
            image: user.image,
            isActive: user.isActive,
            isValidated: user.isValidated,
            createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(user.createdAt)),
            updatedAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(user.createdAt))
        }

    }

}