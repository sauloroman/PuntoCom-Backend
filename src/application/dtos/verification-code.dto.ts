export interface CreateVerificationCodeRequest {
  userId: string
}

export interface GetVerificationCodeRequestI {
  code: string
}

export interface VerificationCodeResponseI {
  id: string,
  code: string,
  expiresAt: string,
  createdAt: string,
  userId: string
}

export interface SendChangePassword {
  userEmail: string,
  username: string
}

export interface SendDeactivationAccount {
  userEmail: string,
  username: string
}

export interface SendForgotPasswordMobile {
  userEmail: string,
  userName: string,
  code: string
}

export interface SendForgotPassword {
  userEmail: string
  username: string,
  token: string
}

export interface SendVerificationCode {
  userEmail: string,
  username: string,
  token: string,
  verificationCode: string
}

export interface SendVerificationCode {
  userEmail: string,
  username: string,
  token: string,
  verificationCode: string
}