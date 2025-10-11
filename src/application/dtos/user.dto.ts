import { Phone } from '../../domain/value-objects';
import { RoleEnum } from '../../domain/value-objects/Role';

export interface ChangeStatusUserRequestI {
  userId: string
}

export interface CheckAdminPasswordDtoI {
  id: string,
  adminPassword: string
}

export interface CreateUserRequestDtoI {
  name: string,
  lastname: string,
  email: string,
  password: string,
  role: RoleEnum
}

export interface UpdateUserRequestDTOI {
  id: string,
  name?: string,
  lastname?: string,
  role?: RoleEnum,
  phone?: string,
}

export interface UpdateUserRequestI {
  name?: string,
  lastname?: string,
  role?: RoleEnum
}

export interface ForgotPasswordRequestI {
  email: string
}

export interface ChangePasswordRequestDtoI {
  token: string,
  newPassword: string,
}

export interface ChangePasswordMobileRequestDtoI {
  newPassword: string,
}

export interface GetUserRequestDtoI {
  id?: string,
  email?: string
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
  userId: string,
}

export interface ChangePasswordRequestI {
  id: string,
  newPassword: string,
}

export interface ResendVerificationCodeRequestI {
  email: string
}

export interface UpdateUserImageDto {
  id: string,
  url: string
}

// Response
export interface UserResponseDtoI {
  id: string,
  name: string,
  lastname: string,
  email: string,
  phone: string,
  role: string,
  image: string,
  isActive: boolean,
  isValidated: boolean
  createdAt: string,
  updatedAt: string
}

