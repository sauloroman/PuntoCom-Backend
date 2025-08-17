export interface CreateCategoryRequestDto {
    name: string,
    description?: string,
}

export interface CategoryResponseDto {
    id: string,
    name: string,
    description: string,
    icon: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}
