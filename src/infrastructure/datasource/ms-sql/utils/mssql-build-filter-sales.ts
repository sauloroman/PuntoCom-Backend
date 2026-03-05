import { FilterSale } from "../../../../application/dtos/sale.dto"
import { MssqlClient } from "../datasources"

export const buildFilterSales = (
    request: Awaited<ReturnType<typeof MssqlClient.getConnection>> extends { request: () => infer R } ? R : any,
    filter: FilterSale
) => {

    const baseWhere = '1 = 1'
    const conditions: string[] = [baseWhere]

    if (filter.prices) {
        request.input('minPrice', filter.prices.minPrice)
        request.input('maxPrice', filter.prices.maxPrice)
        conditions.push('s.sale_total >= @minPrice AND s.sale_total <= @maxPrice')
    }

    if (filter.dates) {
        const adjustedDateTo = new Date(filter.dates.dateTo)
        adjustedDateTo.setHours(23, 59, 59, 999)

        request.input('dateFrom', filter.dates.dateFrom)
        request.input('dateTo', adjustedDateTo)
        conditions.push('s.sale_date >= @dateFrom AND s.sale_date <= @dateTo')
    }

    if (filter.user) {
        request.input('filterUserId', filter.user)
        conditions.push('s.user_id = @filterUserId')
    }


    return conditions.join(' AND ')
}