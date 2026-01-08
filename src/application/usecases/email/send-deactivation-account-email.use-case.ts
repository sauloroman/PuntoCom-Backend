import { SendDeactivationAccount } from '../../dtos/verification-code.dto';
import { EmailService } from '../../services';

export class SendDeactivationAccountEmailUseCase {

  constructor( private readonly emailService: EmailService ){}

  public async execute( { userEmail, username }: SendDeactivationAccount ): Promise<void> {
    await this.emailService.sendDeactivationAccountEmail(
      { 
        meta: {
          to: userEmail, 
          subject: 'PuntoCom - Tu cuenta ha sido desactivada' 
        },
        username: username
      },
    )
  }

}