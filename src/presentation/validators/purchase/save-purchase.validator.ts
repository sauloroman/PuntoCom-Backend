import { SavePurchaseDetail } from "../../../application/dtos/purchase.dto";

export class SavePurchaseValidator {

    public static validate( input: any ): [{ total: number, supplierId: string, details: SavePurchaseDetail[] }?, string?] {
         if ( isNaN(input.total) || input.total <= 0 ) {
            return [undefined, 'El total de la compra no es válido']
        }

        if ( !input.details || input.details.length === 0 ) {
            return [undefined, 'Los detalles de compra son necesarios']
        }

        if ( !input.supplierId || input.supplierId.trim().length === 0 ) {
            return [undefined, 'El proveedor es necesario']
        }

        return [{ 
            total: input.total,
            details: input.details,
            supplierId: input.supplierId
        }]
    }

}