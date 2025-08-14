export interface GetVerificationCodeRequestI {
    code: string
}

export interface GetVerificationCodeResponseI {
  id: string,
  code: string,
  expiresAt: string,
  createdAt: string,
  userId: string
}