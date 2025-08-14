export interface IAttachment {
  filename: string;
  path: string;
}

export interface SendEmailI {
  to: string | string[];
  subject: string;
  htmlBody?: string;
  attachments?: IAttachment[];
}

export interface SendVerificationCodeI {
  meta: SendEmailI,
  username: string,
  token: string,
  verificationCode: string
}

export abstract class EmailService {
  
  abstract sendEmail( sendEmail: SendEmailI ): Promise<boolean>
  abstract sendValidateAccountEmail( data: SendVerificationCodeI ): Promise<boolean>

}