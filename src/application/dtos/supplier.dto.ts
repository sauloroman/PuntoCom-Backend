export interface CreateSupplierRequestDto {
    name: string,
    lastname: string,
    company: string,
    phone: string,
    email: string
}

export interface UpdateSupplierRequestDto {
    id: string,
    name?: string,
    lastname?: string,
    company?: string,
    phone?: string,
    email?: string,
    address?: string
}

export interface UpdateSupplierDto {
    name?: string,
    lastname?: string,
    company?: string,
    phone?: string,
    email?: string,
    address?: string
}

export interface SupplierResponseDto {
    id: string,
    name: string,
    lastname: string,
    company: string,
    phone: string,
    email: string,
    address: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}