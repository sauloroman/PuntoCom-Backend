export interface IAttachment {
  filename: string;
  path: string;
}

export interface SendEmailI {
  to: string | string[];
  subject: string;
  from?: string,
  htmlBody?: string;
  attachments?: IAttachment[];
}

export interface SendVerificationCodeI {
  meta: SendEmailI,
  username: string,
  token: string,
  verificationCode: string
}

export interface SendDeactivationAccountI {
  meta: SendEmailI,
  username: string,
}

export interface SendForgotPasswordI {
  meta: SendEmailI,
  username: string,
  token: string
}

export interface SendChangePasswordI {
  meta: SendEmailI,
  username: string
}

export abstract class EmailService {
  
  abstract sendEmail( sendEmail: SendEmailI ): Promise<boolean>
  abstract sendValidateAccountEmail( data: SendVerificationCodeI ): Promise<void>
  abstract sendValidateAccountEmailMobile( data: SendVerificationCodeI ): Promise<void>
  abstract sendDeactivationAccountEmail( data: SendDeactivationAccountI ): Promise<void>
  abstract sendForgotPasswordEmail( data: SendForgotPasswordI ): Promise<void>
  abstract sendChangePasswordEmail( data: SendChangePasswordI ): Promise<void>

}