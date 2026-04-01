import { ConnectionPool } from "mssql";
import { FilterInventoryAdjustment, InventoryAdjustmentRaw, InventoryAdjustmentResponse } from "../../../../application/dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../../../application/dtos/pagination.dto";
import { InventoryAdjustmentDatasource } from "../../../../domain/datasources";
import { InventoryAdjustment } from "../../../../domain/entities";
import { InfrastructureError } from "../../../errors/infrastructure-error";
import { MssqlClient } from "./mssql-client";
import { InventoryAdjustmentMapper } from "../mappers";
import { buildInventoryAdjustmentsFilter, buildMssqlPaginationOptions } from "../utils";

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
    
    constructor(private readonly pool: ConnectionPool ){}
    
    private async findByID(adjustmentId: string): Promise<InventoryAdjustmentResponse | null> {
        try {    
            const result = await this.pool.request()
                .input('adjustment_id', adjustmentId)
                .query<InventoryAdjustmentRaw>(`
                    ${BASE_QUERY}
                    WHERE ia.adjustment_id = @adjustment_id
                `)
            
            return InventoryAdjustmentMapper.fromSQL(result.recordset[0])
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
            await this.pool.request()
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

    async filterInventoryAdjustment(pagination: PaginationDTO, filter: FilterInventoryAdjustment): Promise<PaginationResponseDto<InventoryAdjustmentResponse>> {
        try {

            const { limit, offset, page } = buildMssqlPaginationOptions( pagination )

            const countRequest = this.pool.request()
            const dataRequest = this.pool.request()

            const countWhere = buildInventoryAdjustmentsFilter(countRequest, filter)
            const dataWhere = buildInventoryAdjustmentsFilter( dataRequest, filter )

            const countResult = await countRequest.query(`
                SELECT COUNT(*) AS total
                FROM Inventory_Adjustment ia
                    INNER JOIN [User] u ON u.user_id = ia.user_id
                    INNER JOIN Product p ON p.product_id = ia.product_id
                WHERE ${countWhere}
            `)

            dataRequest.input('offset', offset).input('limit', limit)
            const dataResult = await dataRequest.query<InventoryAdjustmentRaw>(`
                ${BASE_QUERY}
                WHERE ${dataWhere}
                ORDER BY ia.adjustment_date  
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil(total / limit)
            
            return {
                items: dataResult.recordset.map( InventoryAdjustmentMapper.fromSQL ),
                page: page,
                total: total,
                totalPages: totalPages
            }  

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener los ajustes de inventario filtrados',
                'MSSQL_GET_FILTERED_INVENTORY_ADJUSTMENTS_ERROR',
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

            return result.recordset.map( InventoryAdjustmentMapper.fromSQL )

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener todos los ajustes de inventario',
                'MSSQl_GET_ALL_INVENTORY_ADJUSTMENTS_ERROR',
                error
            )
        }
    }

}