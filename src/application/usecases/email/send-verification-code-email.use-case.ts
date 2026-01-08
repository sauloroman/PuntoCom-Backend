import { SendVerificationCode } from '../../dtos/verification-code.dto';
import { EmailService } from '../../services';

export class SendVerificationCodeEmailUseCase {

  constructor( private readonly emailService: EmailService ){}

  public async execute( { token, userEmail, username, verificationCode }: SendVerificationCode ): Promise<void> {
    await this.emailService.sendValidateAccountEmail(
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