import { PaginationDTO } from "../../../../application/dtos/pagination.dto";

export const buildMssqlPaginationOptions = ( dto: PaginationDTO, entity: string ) => {        
    const page = Number(dto.page) || 1
    const limit = Number(dto.limit) || 10
    const offset = ( page - 1 ) * limit

    let orderBy = `${entity}_createdAt DESC`
    if ( dto.sort ) {
        orderBy = dto.sort
    }

    let where = '1=1'
    if ( dto.filter ) {
        where = dto.filter
    }

    return { offset, limit, where, orderBy, page }
}