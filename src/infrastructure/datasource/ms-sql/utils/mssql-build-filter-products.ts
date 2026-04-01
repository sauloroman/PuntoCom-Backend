import { FilterProducts } from "../../../../application/dtos/product.dto"
import { MssqlClient } from "../datasources"

export const buildProductsFilter = (
    request: Awaited<ReturnType<typeof MssqlClient.getConnection>> extends { request: () => infer R } ? R : any,
    filter: FilterProducts
) => {

    const conditions: string[] = ['1 = 1']

    if (filter.status === 0 || filter.status === 1) {
        request.input('status', filter.status)
        conditions.push('p.product_is_active = @status')
    }

    if (filter.categoryId) {
        request.input('category',  filter.categoryId)
        conditions.push('p.category_id = @category')
    }

    if (filter.supplierId) {
        request.input('supplier', filter.supplierId)
        conditions.push('p.supplier_id = @supplier')
    }

    if (filter.product) {
        request.input('productSearch', `%${filter.product.toLowerCase()}%`)
        conditions.push('(p.product_name LIKE @productSearch OR p.product_description LIKE @productSearch)')
    }

    if (filter.prices?.minPrice && filter.prices?.maxPrice) {
        request.input('minPrice', filter.prices.minPrice)
        request.input('maxPrice', filter.prices.maxPrice)
        conditions.push('(p.product_selling_price BETWEEN @minPrice AND @maxPrice)')
    }

    return conditions.join(' AND ')
}