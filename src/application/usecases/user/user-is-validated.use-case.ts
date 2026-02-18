import { UserRepository } from "../../../domain/repositories";
import { Email } from "../../../domain/value-objects";
import { ApplicationError } from "../../errors";

export class UserIsValidatedUseCase {

    private readonly MESSAGE_USER_NOT_FOUND_ERROR: string = 'USER_NOT_FOUND'
    private readonly MESSAGE_USER_IS_ALREADY_VALIDATED: string = 'USER_ALREADY_VALIDATED'

    constructor(private readonly userRepository: UserRepository){}

    public async execute( userEmail: string ): Promise<boolean> {
        const existingUser = await this.userRepository.findByEmail( new Email(userEmail) )
        if ( !existingUser ) throw new ApplicationError(`El usuario con email ${userEmail} no existe`, this.MESSAGE_USER_NOT_FOUND_ERROR)

        if ( existingUser.isValidated ) throw new ApplicationError('El usuario ya esta validado', this.MESSAGE_USER_IS_ALREADY_VALIDATED )
            
        return false
    }

}