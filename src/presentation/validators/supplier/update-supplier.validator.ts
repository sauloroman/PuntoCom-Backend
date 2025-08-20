import { UpdateSupplierDto } from "../../../application/dtos/supplier.dto";
import { RegularExp } from "../../../config/utils";

export class UpdateSupplierValidator {

    private static MAX_NAME_LENGTH: number = 100;
    private static MAX_LASTNAME_LENGTH: number = 100;
    private static MAX_COMPANY_LENGTH: number = 100;
    private static MAX_ADDRESS_LENGTH: number = 200;
    private static EMAIL_REGEX = RegularExp.EMAIL_REGEX;
    private static PHONE_REGEX = RegularExp.PHONE_REGEX;

    public static validate( input: any ): [ UpdateSupplierDto?, string? ] {

        if ( Object.entries(input).length === 0 ) {
            return [undefined, 'Proporciona información para actualizar']
        }

        if ( input.name && input.name.trim().length > 0 ) {
            if (input.name.length > this.MAX_NAME_LENGTH) {
                return [undefined, `El nombre no puede exceder ${this.MAX_NAME_LENGTH} caracteres`];
            }
        }

        if ( input.lastname && input.lastname.trim().length > 0 ) {
            if (input.lastname.length > this.MAX_LASTNAME_LENGTH) {
                return [undefined, `El apellido no puede exceder ${this.MAX_LASTNAME_LENGTH} caracteres`];
            }
        }

        if ( input.company && input.company.trim().length > 0 ) {
            if (input.company.length > this.MAX_COMPANY_LENGTH) {
                return [undefined, `El nombre de la empresa no puede exceder ${this.MAX_COMPANY_LENGTH} caracteres`];
            }
        }

        if ( input.address && input.address.trim().length > 0 ) {
            if (input.address.length > this.MAX_ADDRESS_LENGTH) {
                return [undefined, `La dirección no puede exceder ${this.MAX_ADDRESS_LENGTH} caracteres`];
            }
        }

        if ( input.email && input.email.trim().length > 0 ) {
            if (!this.EMAIL_REGEX.test(input.email)) {
                return [undefined, 'El email no es válido'];
            }
        }

        if ( input.phone && input.phone.trim().length > 0 ) {
            if (!this.PHONE_REGEX.test(input.phone)) {
                return [undefined, 'El teléfono no es válido'];
            }
        }

        return [
            {
                name: input.name ? input.name.trim() : undefined,
                lastname: input.lastname ? input.lastname.trim() : undefined,
                company: input.company ? input.company.trim() : undefined,
                address: input.address ? input.address.trim() : undefined,
                email: input.email ? input.email.trim() : undefined,
                phone: input.phone ? input.phone.trim() : undefined
            }
        ]

    }
 
}