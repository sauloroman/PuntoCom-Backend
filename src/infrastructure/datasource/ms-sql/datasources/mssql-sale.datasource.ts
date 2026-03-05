import sql, { ConnectionPool } from 'mssql'
import { PaginationDTO, PaginationResponseDto } from "../../../../application/dtos/pagination.dto";
import { 
    SaleResponse, 
    SaleProductDetailResponse, 
    SaleDetailsResponse, 
    FilterSale, 
    SaleRaw, 
    SaleDetailRaw 
} from "../../../../application/dtos/sale.dto";
import { SalesDatasource } from "../../../../domain/datasources";
import { Sale, SaleProductDetail } from "../../../../domain/entities";
import { InfrastructureError } from "../../../errors/infrastructure-error";
import { SaleMapper } from '../mappers';
import { buildFilterSales, buildMssqlPaginationOptions } from '../utils';

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
    INNER JOIN Product p ON p.product_id = d.product_id
`

export class MSSQLSales implements SalesDatasource {

    constructor(private readonly pool: ConnectionPool){}

    private async getSaleById(saleId: string): Promise<SaleResponse | null> {
        
        const result = await this.pool.request()
            .input('sale_id', sql.UniqueIdentifier, saleId)
            .query<SaleRaw>(`
                ${BASE_QUERY}
                WHERE s.sale_id = @sale_id    
            `)

        if (!result.recordset[0]) return null
        return SaleMapper.fromSQL(result.recordset[0])
    }

    private async getSaleDetailById(saleDetailId: string): Promise<SaleProductDetailResponse | null> {
        
        const result = await this.pool.request()
            .input('sale_product_detail_id', sql.UniqueIdentifier, saleDetailId)
            .query<SaleDetailRaw>(`
                ${DETAIL_SELECT_QUERY}
                WHERE d.sale_product_detail_id = @sale_product_detail_id    
            `)

        if (!result.recordset[0]) return null
        return SaleMapper.fromSQLSaleDetail(result.recordset[0])
    }

    async saveSale(data: Sale): Promise<SaleResponse> {
        try { 
            await this.pool.request()
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
            await this.pool.request()
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
            const [saleResult, detailsResult] = await Promise.all([
                this.pool.request()
                    .input('sale_id', sql.UniqueIdentifier, id)
                    .query<SaleRaw>(`
                        ${BASE_QUERY}
                        WHERE s.sale_id = @sale_id    
                    `),

                this.pool.request()
                    .input('sale_id', sql.UniqueIdentifier, id)
                    .query<SaleDetailRaw>(`
                        ${DETAIL_SELECT_QUERY}
                        WHERE d.sale_id = @sale_id
                    `)
            ])

            if (saleResult.recordset.length === 0) return null

            return {
                sale: SaleMapper.fromSQL(saleResult.recordset[0]),
                details: detailsResult.recordset.map(SaleMapper.fromSQLSaleDetail)
            }

        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener la venta con detalles por id',
                'MSSQL_GET_SALE_WITH_DETAILS_BY_ID_ERROR',
                error
            )
        }
    }

    async filterSales(pagination: PaginationDTO, filter: FilterSale): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        try {

            const { page, limit, offset } = buildMssqlPaginationOptions( pagination )

            const countRequest = this.pool.request()
            const countWhere = buildFilterSales(countRequest, filter)

            const countResult = await countRequest.query<{total: number}>(`
                SELECT COUNT(*) AS TOTAL
                FROM Sale s
                LEFT JOIN [User] u ON u.user_id = s.user_id
                WHERE ${countWhere}     
            `)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil(total / limit)

            if ( total === 0 ) return {
                items: [],
                page: page,
                total: 0,
                totalPages: 0
            }

            const dataRequest = this.pool.request()
            const dataWhere = buildFilterSales(dataRequest, filter)

            dataRequest.input('offset', offset).input('limit', limit)
            
            const salesResult = await dataRequest.query<SaleRaw>(`
                ${BASE_QUERY}  
                WHERE ${dataWhere}  
                ORDER BY s.sale_date DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `)
            
            const sales = salesResult.recordset
            if ( salesResult.recordset.length === 0 ) {
                return {
                    items: [],
                    page: page,
                    total: 0,
                    totalPages: 0   
                }
            }

            const detailsRequest = this.pool.request()

            sales.forEach((s, i) => detailsRequest.input(`sid${i}`, s.sale_id ))

            const inParams = sales.map((_, i) => `@sid${i}`).join(', ')

            const detailsResult = await detailsRequest.query<SaleDetailRaw>(`
                ${DETAIL_SELECT_QUERY}
                WHERE d.sale_id IN (${inParams})    
            `)

            const detailsBySaleId = detailsResult.recordset.reduce<
                Record<string, SaleProductDetailResponse[]>
            >((acc, raw) => {
                acc[raw.sale_id] ??= []
                acc[raw.sale_id].push(SaleMapper.fromSQLSaleDetail(raw))
                return acc
            }, {})

            const items: SaleDetailsResponse[] = sales.map( saleRaw => ({
                sale: SaleMapper.fromSQL(saleRaw),
                details: detailsBySaleId[saleRaw.sale_id] ?? []
            }))

            return {
                items: items,
                page: page,
                total: total,
                totalPages: totalPages
            }

        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener las ventas filtradas',
                'MSSQL_GET_FILTERED_SALES_ERROR',
                error
            )
        }
    }

}