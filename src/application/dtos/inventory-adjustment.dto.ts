import { AdjustmentEnum } from "../../domain/value-objects"

export interface SaveInventoryAdjustment {
    productId: string,
    userId: string,
    adjustmentType: AdjustmentEnum,
    adjustmentQuantity: number,
    adjustmentReason: string,
}

export interface InventoryAdjustmentResponse {
    adjustmentId: string,
    adjustmentType: AdjustmentEnum,
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