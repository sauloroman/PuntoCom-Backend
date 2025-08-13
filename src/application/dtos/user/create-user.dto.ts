import { RoleEnum } from '../../../domain/value-objects/Role';

export interface CreateUserRequestDto {
  name: string,
  lastname: string,
  email: string,
  password: string,
  role: RoleEnum
}

export interface CreateUserResponseDto {
  id: string,
  name: string,
  lastname: string,
  email: string,
  role: RoleEnum,
  image: string,
  createdAt: Date,
}