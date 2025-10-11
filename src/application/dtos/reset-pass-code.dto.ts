export interface CreateResetPassCodeRequest {
    userId: string
}

export interface GetResetPassCodeRequest {
    code: string
}

export interface ValidateResetPassCode {
    code: string,
    email: string
}

export interface ResetPassCodeResponse {
    id: string,
    code: string,
    expiresAt: string,
    createdAt: string,
    userId: string
}