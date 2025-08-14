export interface CreateVerificationCodeRequest {
  userId: string
}

export interface CreateVerificationCodeResponse {
  id: string,
  code: string,
  expiresAt: string,
  createdAt: string,
  userId: string
}