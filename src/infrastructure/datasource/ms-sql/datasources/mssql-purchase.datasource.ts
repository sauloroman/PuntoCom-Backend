import { ConnectionPool } from "mssql";
import { PaginationResponseDto, PaginationDTO } from "../../../../application/dtos/pagination.dto";
import { PurchaseResponse, PurchaseDetailResponse, PurchaseDetailsResponse, FilterPurchase, PurchaseRaw, PurchaseDetailRaw } from "../../../../application/dtos/purchase.dto";
import { PurchaseDatasource } from "../../../../domain/datasources";
import { Purchase, PurchaseDetail } from "../../../../domain/entities";
import { PurchaseMapper } from "../mappers/purchase.mapper";
import { InfrastructureError } from "../../../errors/infrastructure-error";
import { buildFilterPurchases, buildMssqlPaginationOptions } from "../utils";

const BASE_QUERY = `
    SELECT 
        p.purchase_id,
        p.purchase_total,
        p.purchase_date,
        u.user_id,
        u.user_name,
        u.user_lastname,
        u.role,
        u.user_image,
        s.supplier_id,
        s.supplier_name,
        s.supplier_lastname,
        s.supplier_phone
    FROM Purchase p
    LEFT JOIN [User] u ON u.user_id = p.user_id
    LEFT JOIN Supplier s ON s.supplier_id = p.supplier_id
`

const DETAIL_SELECT_QUERY = `
    SELECT 
        d.purchase_detail_id,
        d.purchase_quantity,
        d.purchase_unit_price,
        p.product_id,
        p.product_name,
        p.product_image
    FROM Purchase_Detail d
    INNER JOIN Product p ON p.product_id = d.product_id
`

export class MSSQLPurchases implements PurchaseDatasource {
    
    constructor(private readonly pool: ConnectionPool){}

    private async getPurchaseById(purchaseId: string): Promise<PurchaseResponse | null> {
        const result = await this.pool.request()
            .input('purchase_id', purchaseId)
            .query<PurchaseRaw>(`
                ${BASE_QUERY}
                WHERE p.purchase_id = @purchase_id
            `)

        if ( !result.recordset[0] ) return null
        return PurchaseMapper.fromSQL(result.recordset[0])
    }

    private async getPurchaseDetailById(purchaseDetailId: string): Promise<PurchaseDetailResponse | null> {
        const result = await this.pool.request()
            .input('purchase_detail_id', purchaseDetailId)
            .query(`
                ${DETAIL_SELECT_QUERY}
                WHERE d.purchase_detail_id = @purchase_detail_id   
            `)

        if ( !result.recordset[0] ) return null
        return PurchaseMapper.fromSQLPurchaseDetail(result.recordset[0])
    }


    async savePurchase(purchase: Purchase): Promise<PurchaseResponse> {
        try {
            await this.pool.request()
                .input('purchase_id', purchase.id )
                .input('purchase_total', purchase.total.value )
                .input('purchase_date', purchase.date )
                .input('supplier_id', purchase.supplierId )
                .input('user_id', purchase.userId )
                .query(`
                    INSERT INTO Purchase (
                        purchase_id,
                        purchase_total,
                        purchase_date,
                        user_id,
                        supplier_id
                    ) VALUES (
                        @purchase_id,
                        @purchase_total,
                        @purchase_date,
                        @user_id,
                        @supplier_id
                    )
                `)

            return (await this.getPurchaseById(purchase.id))!
        } catch( error ) {
            throw new InfrastructureError(
                'Error al guardar la compra',
                'MSSQL_SAVE_PURCHASES_SALE_ERROR',
                error
            )
        }
    }
    
    async savePurchaseDetails(purchaseDetail: PurchaseDetail): Promise<PurchaseDetailResponse> {
        try {
            await this.pool.request()
                .input('purchase_detail_id', purchaseDetail.id )
                .input('purchase_quantity', purchaseDetail.purchaseQuantity.value )
                .input('purchase_unit_price', purchaseDetail.purchaseUnitPrice.value )
                .input('product_id', purchaseDetail.productId )
                .input('purchase_id', purchaseDetail.purchaseId )
                .query(`
                    INSERT INTO Purchase_Detail (
                        purchase_detail_id,
                        purchase_quantity,
                        purchase_unit_price,
                        product_id,
                        purchase_id
                    ) VALUES (
                        @purchase_detail_id,
                        @purchase_quantity,
                        @purchase_unit_price,
                        @product_id,
                        @purchase_id
                    )
                `)

            return (await this.getPurchaseDetailById(purchaseDetail.id))!
        } catch( error ) {
            throw new InfrastructureError(
                'Error al guardar el detalle de compra',
                'MSSQL_PURCHASES_DETAIL_SALE_ERROR',
                error
            )
        }
    }
    
    async findByID(id: string): Promise<PurchaseDetailsResponse | null> {
        try {

            const [purchaseResult, purchaseDetailResult] = await Promise.all([
                this.pool.request()
                    .input('purchase_id', id)
                    .query<PurchaseRaw>(`
                        ${BASE_QUERY}
                        WHERE p.purchase_id = @purchase_id    
                `),

                this.pool.request()
                    .input('purchase_id', id)
                    .query<PurchaseDetailRaw>(`
                        ${DETAIL_SELECT_QUERY}
                        WHERE d.purchase_id = @purchase_id  
                `)
            ])

            if ( purchaseResult.recordset.length === 0 ) return null
            
            return {
                purchase: PurchaseMapper.fromSQL(purchaseResult.recordset[0]),
                details: purchaseDetailResult.recordset.map( PurchaseMapper.fromSQLPurchaseDetail )
            }

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener la compra con detalles por id',
                'MSSQL_GET_PURCHASE_WITH_DETAILS_BY_ID_ERROR',
                error
            )
        }
    }
    
    async filterPurchases(pagination: PaginationDTO, filter: FilterPurchase): Promise<PaginationResponseDto<PurchaseDetailsResponse>> {
        try {
            const { page, limit, offset } = buildMssqlPaginationOptions(pagination)

            const countRequest = this.pool.request()
            const countWhere = buildFilterPurchases(countRequest, filter)

            const countResult = await countRequest.query<{ total: number }>(`
                SELECT COUNT(*) AS total
                FROM Purchase p
                LEFT JOIN [User] u ON u.user_id = p.user_id
                LEFT JOIN Supplier s ON s.supplier_id = p.supplier_id
                WHERE ${countWhere}   
            `)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil( total / limit )

            if ( total === 0 ) return {
                items: [],
                page: page,
                total: 0,
                totalPages: 0
            }

            const dataRequest = this.pool.request()
            const dataWhere = buildFilterPurchases(dataRequest, filter)

            dataRequest.input('offset', offset).input('limit', limit)

            const purchasesResult = await dataRequest.query<PurchaseRaw>(`
                ${BASE_QUERY}
                WHERE ${dataWhere}
                ORDER BY p.purchase_date DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY    
            `)

            const purchases = purchasesResult.recordset
            if ( purchasesResult.recordset.length === 0 ) {
                return {
                    items: [],
                    page: page,
                    total: 0,
                    totalPages: 0   
                }
            }

            const detailsRequest = this.pool.request()
            
            purchases.forEach((p, i) => detailsRequest.input(`pid${i}`, p.purchase_id ))
            
            const inParams = purchases.map((_, i) => `@pid${i}`).join(', ')
            
            const detailsResult = await detailsRequest.query<PurchaseDetailRaw>(`
                ${DETAIL_SELECT_QUERY}
                WHERE d.purchase_id IN (${inParams})    
            `)
            
            const detailsBySaleId = detailsResult.recordset.reduce<
                Record<string, PurchaseDetailResponse[]>
            >((acc, raw) => {
                acc[raw.purchase_id] ??= []
                acc[raw.purchase_id].push(PurchaseMapper.fromSQLPurchaseDetail(raw))
                return acc
            }, {})
            
            const items: PurchaseDetailsResponse[] = purchases.map( purchaseRaw => ({
                purchase: PurchaseMapper.fromSQL(purchaseRaw),
                details: detailsBySaleId[purchaseRaw.purchase_id] ?? []
            }))
            
            return {
                items: items,
                page: page,
                total: total,
                totalPages: totalPages
            }


        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener las compras filtradas',
                'MSSQL_GET_FILTERED_PURCHASES_ERROR',
                error
            )
        }
    }

}