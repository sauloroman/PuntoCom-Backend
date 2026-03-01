import { PaginationDTO } from "../../../../application/dtos/pagination.dto";

export const buildMssqlPaginationOptions = ( dto: PaginationDTO ) => {        
    const page = Number(dto.page) || 1
    const limit = Number(dto.limit) || 10
    const offset = ( page - 1 ) * limit

    return { offset, limit, page }
}