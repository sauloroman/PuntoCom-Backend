import { SendChangePassword } from "../../dtos/verification-code.dto";
import { EmailService } from "../../services";

export class SendChangePasswordEmailUseCase {

    constructor( private readonly emailService: EmailService ){}

    public async execute( { userEmail, username }: SendChangePassword ) {
        await this.emailService.sendChangePasswordEmail({
            meta: {
                to: userEmail, 
                subject: 'PuntoCom - La contraseña ha sido actualizada' 
            },
            username: username
        })
    }

}