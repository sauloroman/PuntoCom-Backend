import { EmailService } from "../../services";

interface SendChangePassword {
  userEmail: string,
  username: string
}

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