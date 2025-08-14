export interface ValidateUserRequestI {
    token: string,
    code: string,
}

export interface ValidateUserI {
    userId: string
}

export interface ValidateUserResponseI {
  id: string,
  name: string,
  lastname: string,
  email: string,
  role: string,
  image: string,
  isActive: boolean,
  isValidated: boolean
  createdAt: string,
  updatedAt: string
}