import { SendForgotPasswordMobile } from "../../dtos/verification-code.dto";
import { EmailService } from "../../services";

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