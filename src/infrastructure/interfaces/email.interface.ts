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

export interface SendForgotPasswordMobileI {
  meta: SendEmailI,
  username: string,
  code: string
}

export interface SendChangePasswordI {
  meta: SendEmailI,
  username: string
}