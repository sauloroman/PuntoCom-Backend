import { AdjustmentEnum } from "../../domain/value-objects"

export interface SaveInventoryAdjustment {
    productId: string,
    adjustmentType: AdjustmentEnum,
    adjustmentQuantity: number,
    adjustmentReason: string,
}

export interface InventoryAdjustmentResponse {
    adjustmentId: string,
    adjustmentType: AdjustmentEnum,
    adjustmentPrevQuantity: number,
    adjustmentQuantity: number,
    adjustmentReason: string,
    adjustmentDate: string  
    userId: string,
    productId: string,
    User?: {
        id: string,
        name: string,
        role: string,
        image: string,
    },
    Product?: {
        id: string,
        name: string,
        image: string,
        imageCode: string,
        code: string,
        isActive: boolean,
    }
}

export interface InventoryAdjustmentRaw  {
    adjustment_id:            string,
    adjustment_type:          string,
    adjustment_prev_quantity: number,
    adjustment_quantity:      number,
    adjustment_reason:        string,
    adjustment_date:          Date,
    user_id:                  string,
    product_id:               string,
    user_name:                string,
    user_lastname:            string,
    user_image:               string,
    role:                     string,
    product_name:             string,
    product_image:            string,
    product_image_code:       string,
    product_code:             string,
    product_is_active:        boolean,
}