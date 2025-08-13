import { RoleEnum } from '../../../domain/value-objects/Role';

export interface CreateUserRequestDtoI {
  name: string,
  lastname: string,
  email: string,
  password: string,
  role: RoleEnum
}

export interface CreateUserResponseDtoI {
  id: string,
  name: string,
  lastname: string,
  email: string,
  role: RoleEnum,
  image: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date,
}