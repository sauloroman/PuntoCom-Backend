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