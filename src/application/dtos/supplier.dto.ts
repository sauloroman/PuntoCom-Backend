export interface CreateSupplierRequestDto {
    name: string,
    lastname: string,
    company: string,
    phone: string,
    email: string
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