import { Transporter } from 'nodemailer';
import { EmailService, SendEmailI, SendVerificationCodeI } from '../../../application/services/email.service';
import nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './templates/welcome.template';

interface NodemailerServiceOptions {
  mailerService: string,
  mailerEmail: string,
  senderEmailPassword: string,
  postToProvider: boolean
}

export class NodeMailerService implements EmailService {
  
  private transporter: Transporter
  private readonly postToProvider: boolean

  constructor({ mailerEmail, mailerService, postToProvider, senderEmailPassword }: NodemailerServiceOptions) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword
      }
    })
    this.postToProvider = postToProvider
  }

  async sendEmail(sendEmail: SendEmailI): Promise<boolean> {
    return true
  }

  async sendValidateAccountEmail({ meta, token, username, verificationCode }: SendVerificationCodeI): Promise<boolean> {

    const { subject, to } = meta
    const html = welcomeEmailTemplate( username, token, verificationCode )

    const sentInformation = await this.transporter.sendMail({
      from: `PuntoCom - <${this.transporter.options.from?.toString()}>`,
      to,
      subject,
      html
    })

    if (!sentInformation) return false

    return true
  }

}