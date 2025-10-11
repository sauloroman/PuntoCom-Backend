import { EmailService } from "../../services";

interface SendForgotPasswordMobile {
    userEmail: string,
    userName: string,
    code: string
}

export class SendForgotPasswordEmailMobileUseCase {

    constructor(private readonly emailService: EmailService){}

    public async execute({ code, userEmail, userName }: SendForgotPasswordMobile) {
        await this.emailService.sendForgotPasswordEmailMobile({
            meta: {
                to: userEmail,
                subject: 'PuntoCom - Reestablece tu contraseña'
            },
            code: code,
            username: userName
        })
    }

}   