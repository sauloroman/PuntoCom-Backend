import { FilterPurchase } from "../../../../application/dtos/purchase.dto";
import { MssqlClient } from "../datasources";

export const buildFilterPurchases = (
    request: Awaited<ReturnType<typeof MssqlClient.getConnection>> extends { request: () => infer R } ? R : any,
    filter: FilterPurchase
) => {

    const baseWhere = '1 = 1'
    const conditions: string[] = [baseWhere]

    if (filter.prices) {
        request.input('minPrice', filter.prices.minPrice)
        request.input('maxPrice', filter.prices.maxPrice)
        conditions.push('p.purchase_total >= @minPrice AND p.purchase_total <= @maxPrice')
    }

    if (filter.dates) {
        const adjustedDateTo = new Date(filter.dates.dateTo)
        adjustedDateTo.setHours(23, 59, 59, 999)

        request.input('dateFrom', filter.dates.dateFrom)
        request.input('dateTo', adjustedDateTo)
        conditions.push('p.purchase_date >= @dateFrom AND p.purchase_date <= @dateTo')
    }

    if (filter.user) {
        request.input('filterUserId', filter.user)
        conditions.push('p.user_id = @filterUserId')
    }

    if (filter.supplier) {
        request.input('filterSupplierId', filter.supplier)
        conditions.push('p.supplier_id = @filterSupplierId')
    }
    return conditions.join(' AND ')

}