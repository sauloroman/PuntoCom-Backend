import { SaleDetail } from "../../../application/dtos/sale.dto"

export class SaveSaleValidator {

    public static validate( input: any ): [{total: number, details: SaleDetail[] }?, string?] {        
        if ( isNaN(input.total) || input.total <= 0 ) {
            return [undefined, 'El total de la venta no es válido']
        }

        if ( !input.details || input.details.length === 0 ) {
            return [undefined, 'Los detalles de venta son necesarios']
        }

        return [{ 
            total: input.total,
            details: input.details 
        }]
    }

}