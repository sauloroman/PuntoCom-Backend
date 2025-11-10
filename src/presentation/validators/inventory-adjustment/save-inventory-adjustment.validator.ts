import { SaveInventoryAdjustment } from "../../../application/dtos/inventory-adjustment.dto";

export class SaveInventoryAdjustmentValidator {

    public static validate( input: any ): [SaveInventoryAdjustment?, string?] {

        if ( input.productId === null || input.productId === undefined || input.productId.trim() === '' ) {
            return [ undefined, 'El id del producto es obligatorio' ]
        }                

        if ( input.userId === null || input.userId === undefined || input.userId.trim() === '' ) {
            return [ undefined, 'El id del usuario es obligatorio']
        }

        if ( input.adjustmentType === null || input.adjustmentType === undefined || input.adjustmentType.trim() === '' ) {
            return [ undefined, 'El tipo de ajuste es obligatorio' ]
        }

        const validAdjustmentTypes = ['entrada', 'salida']
        if ( !validAdjustmentTypes.includes(input.adjustmentType) ) {
            return [ undefined, 'El tipo de ajuste no es válido' ]
        }

        if ( input.adjustmentQuantity === null || input.adjustmentQuantity === undefined ) {
            return [ undefined, 'La cantidad de ajuste es obligatoria' ]
        }

        if ( typeof input.adjustmentQuantity !== 'number' ) {
            return [ undefined, 'La cantidad de ajuste debe ser un número' ]
        }

        if ( input.adjustmentQuantity <= 0 ) {
            return [ undefined, 'La cantidad de ajuste debe ser mayor a cero' ]
        }

        if ( input.adjustmentReason === null || input.adjustmentReason === undefined || input.adjustmentReason.trim() === '' ) {
            return [ undefined, 'La razón del ajuste es obligatoria' ]
        }

        if ( input.adjustmentReason.trim().length < 3 ) {
            return [ undefined, 'La razón del ajuste debe tener al menos 3 caracteres' ]
        }

        const validatedData: SaveInventoryAdjustment = {
            productId: input.productId.trim(),
            userId: input.userId.trim(),
            adjustmentType: input.adjustmentType,
            adjustmentQuantity: input.adjustmentQuantity,
            adjustmentReason: input.adjustmentReason.trim()
        };

        return [ validatedData, undefined ];
    }

}
