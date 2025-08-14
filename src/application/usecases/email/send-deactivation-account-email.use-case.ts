import { EmailService } from '../../services/email.service';

interface SendDeactivationAccount {
  userEmail: string,
  username: string
}

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