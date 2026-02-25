import sql from 'mssql'
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { SaleResponse, SaleProductDetailResponse, SaleDetailsResponse, SaleFilters, SaleRaw, SaleDetailRaw } from "../../../application/dtos/sale.dto";
import { DatesAdapter } from "../../../config/plugins";
import { SalesDatasource } from "../../../domain/datasources";
import { Sale, SaleProductDetail } from "../../../domain/entities";
import { Money } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { MssqlClient } from "./mssql-client";
import { buildMssqlPaginationOptions } from "./utils/mssql-pagination-options";

const BASE_QUERY = `
    SELECT 
        s.sale_id,
        s.sale_total,
        s.sale_date,
        s.sale_code,
        u.user_id,
        u.user_name,
        u.user_lastname,
        u.role,
        u.user_image
    FROM Sale s
    LEFT JOIN [User] u ON u.user_id = s.user_id 
`

const DETAIL_SELECT_QUERY = `
    SELECT
        d.sale_product_detail_id,
        d.sale_product_detail_quantity,
        d.sale_product_detail_unit_price,
        d.sale_product_detail_discount,
        d.product_id,
        d.sale_id,
        p.product_name,
        p.product_code
    FROM Sale_Product_Detail d
    LEFT JOIN Product p ON p.product_id = d.product_id
`

export class MSSQLSales implements SalesDatasource {

    private toDomain(saleData: SaleRaw): SaleResponse {
        return {
            saleId: saleData.sale_id,
            saleTotal: new Money(parseFloat(`${saleData.sale_total}`)).value,
            saleDate: DatesAdapter.formatLocal(new Date(saleData.sale_date)),
            saleCode: saleData.sale_code,
            User: saleData.user_id ? {
                id: saleData.user_id ?? '',
                name: `${saleData.user_name} ${saleData.user_lastname}`,
                role: saleData.role ?? '',
                image: saleData.user_image ?? ''
            } : undefined
        }
    }

    private toDomainSaleDetail(saleDetailData: SaleDetailRaw): SaleProductDetailResponse {
        return {
            id: saleDetailData.sale_product_detail_id,
            saleQuantity: saleDetailData.sale_product_detail_quantity,
            saleUnitPrice: new Money(parseFloat(`${saleDetailData.sale_product_detail_unit_price}`)).value,
            saleDiscount: new Money(parseFloat(`${saleDetailData.sale_product_detail_discount}`)).value,
            productId: saleDetailData.product_id,
            saleId: saleDetailData.sale_id,
            Product: saleDetailData.product_id ? {
                id: saleDetailData.product_id,
                name: saleDetailData.product_name,
                code: saleDetailData.product_code
            } : undefined
        }
    }

    private async getSaleById(saleId: string): Promise<SaleResponse | null> {
        const pool = await MssqlClient.getConnection()

        const result = await pool.request()
            .input('sale_id', sql.UniqueIdentifier, saleId)
            .query<SaleRaw>(`
                ${BASE_QUERY}
                WHERE s.sale_id = @sale_id    
            `)

        if (!result.recordset[0]) return null
        return this.toDomain(result.recordset[0])
    }

    private async getSaleDetailById(saleDetailId: string): Promise<SaleProductDetailResponse | null> {
        const pool = await MssqlClient.getConnection()

        const result = await pool.request()
            .input('sale_product_detail_id', sql.UniqueIdentifier, saleDetailId)
            .query<SaleDetailRaw>(`
                ${DETAIL_SELECT_QUERY}
                WHERE d.sale_product_detail_id = @sale_product_detail_id    
            `)

        if (!result.recordset[0]) return null
        return this.toDomainSaleDetail(result.recordset[0])
    }

    private buildFilterWhere(
        request: Awaited<ReturnType<typeof MssqlClient.getConnection>> extends { request: () => infer R } ? R : any,
        baseWhere: string,
        filter: SaleFilters
    ): string {
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

    async saveSale(data: Sale): Promise<SaleResponse> {
        try {
            const pool = await MssqlClient.getConnection()

            await pool.request()
                .input('sale_id', sql.UniqueIdentifier, data.id)
                .input('sale_total', data.total.value )
                .input('sale_date', data.date)
                .input('sale_code', data.code.value )
                .input('user_id', sql.UniqueIdentifier, data.userId)
                .query(`
                    INSERT INTO Sale (
                        sale_id,
                        sale_total,
                        sale_date,
                        sale_code,
                        user_id
                    ) 
                    VALUES (
                        @sale_id,
                        @sale_total,
                        @sale_date,
                        @sale_code,
                        @user_id  
                    )
                `)

            return (await this.getSaleById(data.id))!

        } catch (error) {
            throw new InfrastructureError(
                'Error al guardar la venta',
                'MSSQL_SAVE_SALE_ERROR',
                error
            )
        }
    }

    async saveSaleDetails(data: SaleProductDetail): Promise<SaleProductDetailResponse> {
        try {
            const pool = await MssqlClient.getConnection()

            await pool.request()
                .input('sale_product_detail_id', sql.UniqueIdentifier, data.id)
                .input('sale_product_detail_quantity', data.saleQuantity.value )
                .input('sale_product_detail_unit_price', data.saleUnitPrice.value)
                .input('sale_product_detail_discount', data.saleDiscount.value)
                .input('product_id', sql.UniqueIdentifier, data.productId)
                .input('sale_id', sql.UniqueIdentifier, data.saleId)
                .query(`
                    INSERT INTO Sale_Product_Detail (
                        sale_product_detail_id,
                        sale_product_detail_quantity,
                        sale_product_detail_unit_price,
                        sale_product_detail_discount,
                        product_id,
                        sale_id
                    ) VALUES (
                        @sale_product_detail_id,
                        @sale_product_detail_quantity,
                        @sale_product_detail_unit_price,
                        @sale_product_detail_discount,
                        @product_id,
                        @sale_id
                    )
                `)

            return (await this.getSaleDetailById(data.id))!
        } catch (error) {
            throw new InfrastructureError(
                'Error al guardar el detalle de venta',
                'MSSQL_SAVE_DETAIL_SALE_ERROR',
                error
            )
        }
    }

    async findById(id: string): Promise<SaleDetailsResponse | null> {
        try {

            const pool = await MssqlClient.getConnection()

            const [saleResult, detailsResult] = await Promise.all([
                pool.request()
                    .input('sale_id', sql.UniqueIdentifier, id)
                    .query<SaleRaw>(`
                        ${BASE_QUERY}
                        WHERE s.sale_id = @sale_id    
                    `),

                pool.request()
                    .input('sale_id', sql.UniqueIdentifier, id)
                    .query<SaleDetailRaw>(`
                        ${DETAIL_SELECT_QUERY}
                        WHERE d.sale_id = @sale_id
                    `)
            ])

            if (saleResult.recordset.length === 0) return null

            return {
                sale: this.toDomain(saleResult.recordset[0]),
                details: detailsResult.recordset.map(this.toDomainSaleDetail)
            }

        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener la venta con detalles por id',
                'MSSQL_GET_SALE_WITH_DETAILS_BY_ID_ERROR',
                error
            )
        }
    }

    async getSales( pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>> {

        try {

            const pool = await MssqlClient.getConnection()
            const { limit, offset, orderBy, page, where } = buildMssqlPaginationOptions(pagination, 'sale_date')

            const salesResult = await pool.request()
                .input('limit', limit)
                .input('offset', offset)
                .query<SaleRaw>(`
                    ${BASE_QUERY}
                    WHERE ${where}
                    ORDER BY ${orderBy}
                    OFFSET @offset ROWS
                    FETCH NEXT @limit ROWS ONLY
                `)

            if (salesResult.recordset.length === 0) {
                return {
                    items: [],
                    total: 0,
                    totalPages: 0,
                    page
                }
            }

            const saleIds = salesResult.recordset.map(s => `'${s.sale_id}'`).join(',')

            const detailsResult = await pool.request()
                .query<SaleDetailRaw>(`
                ${DETAIL_SELECT_QUERY}
                WHERE d.sale_id IN (${saleIds})
            `)

            const detailsMap = new Map<string, SaleProductDetailResponse[]>()

            for (const detail of detailsResult.recordset) {

                const mapped = this.toDomainSaleDetail(detail)

                if (!detailsMap.has(detail.sale_id)) {
                    detailsMap.set(detail.sale_id, [])
                }

                detailsMap.get(detail.sale_id)!.push(mapped)
            }

            const salesWithDetails: SaleDetailsResponse[] =
                salesResult.recordset.map(sale => ({
                    sale: this.toDomain(sale),
                    details: detailsMap.get(sale.sale_id) ?? []
                }))

            const countResult = await pool.request()
                .query(`SELECT COUNT(*) AS total FROM Sale WHERE ${where}`)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil(total / limit)

            return {
                items: salesWithDetails,
                total,
                totalPages,
                page
            }

        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener las ventas',
                'MSSQL_GET_SALES_ERROR',
                error
            )
        }
    }

    async filterSales(
        filter: SaleFilters,
        pagination: PaginationDTO
    ): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        try {

            const pool = await MssqlClient.getConnection()
            const { offset, limit, orderBy, page, where } = buildMssqlPaginationOptions(pagination, 'sale_date')

            const salesRequest = pool.request()
                .input('limit', limit)
                .input('offset', offset)

            const filterWhere = this.buildFilterWhere(salesRequest, where, filter)

            const salesResult = await salesRequest.query<SaleRaw>(`
                ${BASE_QUERY}
                WHERE ${filterWhere}
                ORDER BY ${orderBy}
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `)

            if (salesResult.recordset.length === 0) {
                return {
                    items: [],
                    total: 0,
                    totalPages: 0,
                    page
                }
            }

            const saleIds = salesResult.recordset.map(s => `'${s.sale_id}'`).join(',')

            const detailsResult = await pool.request()
                .query<SaleDetailRaw>(`
                    ${DETAIL_SELECT_QUERY}
                    WHERE d.sale_id IN (${saleIds})
                `)

            const detailsMap = new Map<string, SaleProductDetailResponse[]>()

            for (const detail of detailsResult.recordset) {
                const mapped = this.toDomainSaleDetail(detail)

                if (!detailsMap.has(detail.sale_id)) {
                    detailsMap.set(detail.sale_id, [])
                }

                detailsMap.get(detail.sale_id)!.push(mapped)
            }

            const salesWithDetails: SaleDetailsResponse[] = salesResult.recordset.map(sale => ({
                sale: this.toDomain(sale),
                details: detailsMap.get(sale.sale_id) ?? []
            }))

            const countRequest = pool.request()
            this.buildFilterWhere(countRequest, where, filter)

            const countResult = await countRequest.query(`
                SELECT COUNT(*) AS total
                FROM Sale s
                WHERE ${filterWhere}
            `)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil(total / limit)

            return {
                items: salesWithDetails,
                total,
                totalPages,
                page
            }

        } catch (error) {
            throw new InfrastructureError(
                'Error al filtrar las ventas',
                'MSSQL_FILTER_SALES_ERROR',
                error
            )
        }
    }

}