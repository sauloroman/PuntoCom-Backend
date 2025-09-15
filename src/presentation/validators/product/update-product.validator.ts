import { UpdateProductRequestDto } from "../../../application/dtos/product.dto";

export class UpdateProductValidator {
    
    private static MAX_NAME_LENGTH = 100;
    private static MAX_DESCRIPTION_LENGTH = 220;

    public static validate( input: any ): [UpdateProductRequestDto?, string? ] {

        if ( input.name && input.name.length > 0 ) {
            if ( input.name.length > this.MAX_NAME_LENGTH ) {
                return [undefined, `El nombre no puede exceder ${this.MAX_NAME_LENGTH}`]
            }
        }

        if ( input.description && input.description.length > 0 ) {
            if ( input.description.length > this.MAX_DESCRIPTION_LENGTH ) {
                return [undefined, `La descripción no puede exceder ${this.MAX_DESCRIPTION_LENGTH}`]
            }
        }

        if ( input.sellingPrice ) {
            if ( isNaN(input.sellingPrice) || input.sellingPrice <= 0 ) {
                return [undefined, 'El precio de venta debe ser un número positivo']
            }
        }

        if ( input.stock ) {
            if ( isNaN(input.stock) || !Number.isInteger(input.stock) || input.stock < 0 ) {
                return [undefined, 'El stock debe ser un número entero postivo']
            }
        }

        if ( input.stockMin ) {
            if ( 
                isNaN(input.stockMin) || 
                !Number.isInteger(input.stockMin) || 
                input.stockMin < 0 
            ) {
                return [undefined, 'El stock mínimo debe ser un número entero postivo']
            }
        }     

        return [{
            name: input.name && input.name.trim(),
            description: input.description && input.description.trim(),
            sellingPrice: input.sellingPrice,
            stock: input.stock,
            stockMin: input.stockMin,
            categoryId: input.categoryId,
            supplierId: input.supplierId 
        }]

    }

}