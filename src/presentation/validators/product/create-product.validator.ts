import { CreateProduct } from "../../../application/dtos/product.dto";

export class CreateProductValidator {
    
    private static MAX_NAME_LENGTH = 100    
    private static MAX_DESCRIPTION_LENGTH = 220

    public static validate(input: any): [CreateProduct?, string?] {

        if ( !input.name || input.name.trim().length === 0 ) {
            return [undefined, 'El nombre es obligatorio']
        } else if ( input.name.length > this.MAX_NAME_LENGTH ) {
            return [undefined, `El nombre no puede exceder ${this.MAX_NAME_LENGTH} caracteres`]
        }

        if ( !input.description && input.description?.trim().length > 0 ) {
            if ( input.description.length > this.MAX_DESCRIPTION_LENGTH ) {
                return [undefined, `La descripción no puede exceder ${this.MAX_DESCRIPTION_LENGTH} caracteres`]
            }
        }

        if ( isNaN(input.sellingPrice) || input.sellingPrice <= 0 ) {
            return [undefined, 'El precio de venta debe ser un número positivo']
        }

        if ( isNaN(input.stock) || !Number.isInteger(input.stock) || input.stock < 0 ) {
            return [undefined, 'El stock debe ser un número entero postivo']
        }

        if ( 
            isNaN(input.stockMin) || 
            !Number.isInteger(input.stockMin) || 
            input.stockMin < 0 || 
            input.stock < input.stockMin 
        ) {
            return [undefined, 'El stock mínimo debe ser un número entero postivo y menor que el stock ingresado']
        }

        if ( !input.categoryId || input.categoryId.trim().length === 0 ) {
            return [undefined, 'El id de la categoría es obligatorio']
        }

        if ( !input.supplierId || input.supplierId.trim().length === 0 ) {
            return [undefined, 'El id del proveedor es obligatorio']
        }

        return [{
            name: input.name.trim(), 
            description: input.description && input.description.trim(),
            sellingPrice: input.sellingPrice,
            stock: input.stock,
            stockMin: input.stockMin,
            categoryId: input.categoryId,
            supplierId: input.supplierId,
        }]
    }
    
}