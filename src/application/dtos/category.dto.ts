export interface CreateCategoryRequestDto {
    name: string,
    description?: string,
}

export interface UpdateCategoryRequestDto {
    name?: string,
    description?: string,
}

export interface UpdateCategoryRequest {
    id: string,
    name?: string,
    description?: string,
}

export interface ChangeCategoryStatusRequestDto {
    id: string
}

export interface UpdateCategoryImageDto {
    id: string,
    url: string
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
