import { EmailService, SendChangePasswordI, SendDeactivationAccountI, SendEmailI, SendForgotPasswordI, SendVerificationCodeI } from '../../../application/services/email.service';
import { welcomeEmailTemplate, accountDeactivatedEmailTemplate, resetPasswordEmailTemplate, passwordChangedEmailTemplate, codeOnlyEmailTemplate } from '../../../config/templates/email';
import { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';

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
    const sentInformation = await this.transporter.sendMail({
      from: sendEmail.from,
      to: sendEmail.to,
      subject: sendEmail.subject,
      html: sendEmail.htmlBody,
    })

    if (!sentInformation) return false
    return true
  }

  async sendDeactivationAccountEmail({ meta, username }: SendDeactivationAccountI ): Promise<void> {
    const { subject, to } = meta
    const htmlBody = accountDeactivatedEmailTemplate(username)

    await this.sendEmail({
      from: `PuntoCom - <${this.transporter.options.from?.toString()}>`,
      to,
      subject,
      htmlBody: htmlBody,
      attachments: [],
    })
  }

  async sendValidateAccountEmail({ meta, token, username, verificationCode }: SendVerificationCodeI): Promise<void> {
    const { subject, to } = meta
    const htmlBody = welcomeEmailTemplate( username, token, verificationCode )

    await this.sendEmail({
      from: `PuntoCom - <${this.transporter.options.from?.toString()}>`,
      to,
      subject,
      htmlBody: htmlBody,
      attachments: [],
    })

  }

  async sendValidateAccountEmailMobile({ meta, username, verificationCode }: SendVerificationCodeI): Promise<void> {
    const { subject, to } = meta
    const htmlBody = codeOnlyEmailTemplate( username, verificationCode )

    await this.sendEmail({
      from: `PuntoCom - <${this.transporter.options.from?.toString()}>`,
      to,
      subject,
      htmlBody: htmlBody,
      attachments: [],
    })

  }
  
  async sendForgotPasswordEmail({ meta, token, username }: SendForgotPasswordI): Promise<void> {
    const { subject, to } = meta  
    const htmlBody = resetPasswordEmailTemplate( username, token )

    await this.sendEmail({
      from: `PuntoCom - <${this.transporter.options.from?.toString()}>`,
      to,
      subject,
      htmlBody: htmlBody,
      attachments: [],
    })
  }

  async sendChangePasswordEmail({ meta, username }: SendChangePasswordI): Promise<void> {
    const { subject, to } = meta  
    const htmlBody = passwordChangedEmailTemplate( username )

    await this.sendEmail({
      from: `PuntoCom - <${this.transporter.options.from?.toString()}>`,
      to,
      subject,
      htmlBody: htmlBody,
      attachments: [],
    })
  }

}