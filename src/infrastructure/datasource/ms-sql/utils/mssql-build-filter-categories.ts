import { FilterCategories } from "../../../../application/dtos/category.dto";
import { MssqlClient } from "../datasources";

export const buildCategoriesFilter = (
    request: Awaited<ReturnType<typeof MssqlClient.getConnection>> extends { request: () => infer R } ? R : any,
    filter: FilterCategories
) => {

    const baseWhere = '1 = 1'
    const conditions: string[] = [baseWhere]

    if ( filter.status === 0 || filter.status === 1 ) {
        request.input('status', filter.status )
        conditions.push('category_is_active = @status')
    } 

    if ( filter.categoryName ) {
        const str = filter.categoryName.toLowerCase()
        conditions.push(`category_name LIKE '%${str}%' OR category_description LIKE '%${str}%'`)
    }

    return conditions.join(' AND ')
}