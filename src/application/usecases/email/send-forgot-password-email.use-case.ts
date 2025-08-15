import { EmailService } from "../../services";

interface SendForgotPassword {
    userEmail: string
    username: string,
    token: string
}

export class SendForgotPasswordEmailUseCase {

    constructor( private readonly emailService: EmailService ){}

    public async execute({ token, username, userEmail }: SendForgotPassword) {
        await this.emailService.sendForgotPasswordEmail({
            meta: {
                to: userEmail,
                subject: 'PuntoCom - Reestablece tu contraseña'
            },
            token: token,
            username: username
        })
    }

}