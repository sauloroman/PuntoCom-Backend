export interface PaginationDTO {
    page?: number,
    limit?: number,
    sort?: string,
    filter?: string
}

export interface PaginationResponseDto<T> { 
    total: number; 
    page: number; 
    totalPages: number; 
    items: T[]; 
}