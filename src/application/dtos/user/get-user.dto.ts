export interface GetUserByIdRequestDtoI {
  id: string
}

export interface GetUserByIdResponseDtoI {
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