import { InventoryAdjustmentRaw, InventoryAdjustmentResponse } from "../../../../application/dtos/inventory-adjustment.dto";
import { AdjustmentEnum } from "../../../../domain/value-objects";

export class InventoryAdjustmentMapper {

    public static fromSQL( row: InventoryAdjustmentRaw ): InventoryAdjustmentResponse {
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

}