import { RoleEnum } from '../../domain/value-objects/Role';

export interface ChangeStatusUserRequestI {
    userId: string
}

export interface CreateUserRequestDtoI {
  name: string,
  lastname: string,
  email: string,
  password: string,
  role: RoleEnum
}

export interface GetUserByIdRequestDtoI {
  id: string
}

export interface LoginUserRequestI {
  email: string,
  password: string
}

export interface ValidateUserRequestI {
    token: string,
    code: string,
}

export interface ValidateUserI {
    userId: string
}

// Response
export interface UserResponseDtoI {
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

