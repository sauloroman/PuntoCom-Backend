import { RoleEnum } from "../../../../generated/prisma"

export interface ChangeStatusUserRequestI {
    userId: string
}

export interface ChangeStatusUserResponsetI {
    id: string,
    name: string,
    lastname: string,
    email: string,
    role: RoleEnum,
    image: string,
    isActive: boolean,
    isValidated: boolean
    updatedAt: string, 
    createdAt: string
}