import { EmailService } from '../../services/email.service';

interface SendVerificationCode {
  userEmail: string,
  username: string,
  token: string,
  verificationCode: string
}

export class SendVerificationCodeEmailMobileUseCase {

  constructor( private readonly emailService: EmailService ){}

  public async execute( { token, userEmail, username, verificationCode }: SendVerificationCode ): Promise<void> {
    await this.emailService.sendValidateAccountEmailMobile(
      { 
        meta: {
          to: userEmail, 
          subject: 'PuntoCom - Valida tu correo electrónico' 
        }, 
        token: token,
        username: username,
        verificationCode: verificationCode
      },
    )
  }

}