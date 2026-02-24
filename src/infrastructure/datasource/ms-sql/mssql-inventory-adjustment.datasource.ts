import { InventoryAdjustmentRaw, InventoryAdjustmentResponse } from "../../../application/dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { InventoryAdjustmentDatasource } from "../../../domain/datasources";
import { InventoryAdjustment } from "../../../domain/entities";
import { AdjustmentEnum } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { MssqlClient } from "./mssql-client";
import { buildMssqlPaginationOptions } from "./utils/mssql-pagination-options";

const BASE_QUERY = `
    SELECT 
        ia.adjustment_id,
        ia.adjustment_type,
        ia.adjustment_prev_quantity,
        ia.adjustment_quantity,
        ia.adjustment_reason,
        ia.adjustment_date,
        ia.user_id,
        ia.product_id,
        u.user_name,
        u.user_lastname,
        u.user_image,
        u.role,
        p.product_name,
        p.product_image,
        p.product_image_code,
        p.product_code,
        p.product_is_active
    FROM Inventory_Adjustment ia
    INNER JOIN [User] u ON u.user_id = ia.user_id
    INNER JOIN Product p ON p.product_id = ia.product_id
`

export class MSSQLInventoryAdjustment implements InventoryAdjustmentDatasource {

    private toDomain( row: InventoryAdjustmentRaw ): InventoryAdjustmentResponse {
        return {
            adjustmentId: row.adjustment_id,
            adjustmentType: row.adjustment_type as AdjustmentEnum,
            adjustmentPrevQuantity: row.adjustment_prev_quantity,
            adjustmentQuantity: row.adjustment_quantity,
            adjustmentReason: row.adjustment_reason,
            adjustmentDate: row.adjustment_date.toISOString(),
            userId: row.user_id,
            productId: row.product_id,
            User: row.product_id ? {
                id: row.user_id,
                name: (row.user_name && row.user_lastname) ? `${row.user_name} ${row.user_lastname}` : '',
                role: row.role,
                image: row.user_image
            } : undefined,
            Product: row.product_id ? {
                id: row.product_id,
                name: row.product_name,
                image: row.product_image,
                imageCode: row.product_image_code,
                code: row.product_code,
                isActive: row.product_is_active
            } : undefined
        }
    }
    
    private async findByID(adjustmentId: string): Promise<InventoryAdjustmentResponse | null> {
        try {
            const pool = await MssqlClient.getConnection()
    
            const result = await pool.request()
                .input('adjustment_id', adjustmentId)
                .query<InventoryAdjustmentRaw>(`
                    ${BASE_QUERY}
                    WHERE ia.adjustment_id = @adjustment_id
                `)
            
            return this.toDomain(result.recordset[0])
        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener el ajuste de inventario por id',
                'MSSQL_GET_INVENTORY_ADJUSTMENT_BY_ID_ERROR',
                error
            )
        }
    }

    async save(inventoryAdjustment: InventoryAdjustment): Promise<InventoryAdjustmentResponse> {
        try {
            const pool = await MssqlClient.getConnection()

            await pool.request()
                .input('adjustment_id',            inventoryAdjustment.id)
                .input('adjustment_type',          inventoryAdjustment.adjustmentType.value)
                .input('adjustment_prev_quantity', inventoryAdjustment.adjustmentPrevQuantity.value)
                .input('adjustment_quantity',      inventoryAdjustment.adjustmentQuantity.value)
                .input('adjustment_reason',        inventoryAdjustment.adjustmentReason)
                .input('adjustment_date',          inventoryAdjustment.adjustmentDate)
                .input('user_id',                  inventoryAdjustment.userId)
                .input('product_id',               inventoryAdjustment.productId)
                .query(`
                    INSERT INTO Inventory_Adjustment (
                        adjustment_id,
                        adjustment_type,
                        adjustment_prev_quantity,
                        adjustment_quantity,
                        adjustment_reason,
                        adjustment_date,
                        user_id,
                        product_id
                    )
                    VALUES (
                        @adjustment_id,
                        @adjustment_type,
                        @adjustment_prev_quantity,
                        @adjustment_quantity,
                        @adjustment_reason,
                        @adjustment_date,
                        @user_id,
                        @product_id
                    )
                `)

            return (await this.findByID(inventoryAdjustment.id))!

        } catch( error ) {
            throw new InfrastructureError(
                'Error al registrar el ajuste de inventario',
                'MSSQL_SAVE_INVENTORY_ADJUSTMENT_ERROR',
                error
            )
        }
    }
    
    async listInventoryAdjustments(pagination: PaginationDTO): Promise<PaginationResponseDto<InventoryAdjustmentResponse>> {
        try {
            const pool = await MssqlClient.getConnection()

            const { limit, offset, orderBy, page, where } = buildMssqlPaginationOptions(pagination, 'adjustment_date')

            const [ adjustmentsResult, countResult ] = await Promise.all([
                pool.request()
                    .input('limit', limit)
                    .input('offset', offset)
                    .query<InventoryAdjustmentRaw>(`
                        ${BASE_QUERY}
                        WHERE ${where}
                        ORDER BY ${orderBy}
                        OFFSET @offset ROWS
                        FETCH NEXT @limit ROWS ONLY
                    `),

                pool.request()
                    .query(`SELECT COUNT(*) AS total FROM Inventory_Adjustment ia WHERE ${where}`)
            ])

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil( total / limit )

            return {
                items: adjustmentsResult.recordset.map( this.toDomain ),
                page: page,
                total: total,
                totalPages: totalPages
            }

        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener los ajustes de inventario',
                'MSSQl_GET_ALL_INVENTORY_ADJUSTMENTS_ERROR',
                error
            )
        }
    }
    
    async getAllInventoryAdjustments(): Promise<InventoryAdjustmentResponse[]> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .query<InventoryAdjustmentRaw>(`
                    ${BASE_QUERY}
                    ORDER BY ia.adjustment_date DESC    
                `)

            return result.recordset.map( this.toDomain )

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener todos los ajustes de inventario',
                'MSSQl_GET_ALL_INVENTORY_ADJUSTMENTS_ERROR',
                error
            )
        }
    }

}