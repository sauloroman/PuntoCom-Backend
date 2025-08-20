import { CreateSupplierRequestDto } from "../../../application/dtos/supplier.dto";
import { RegularExp } from "../../../config/utils";

export class CreateSupplierValidator {

    private static MAX_NAME_LENGTH: number = 100;
    private static MAX_LASTNAME_LENGTH: number = 100;
    private static MAX_COMPANY_LENGTH: number = 100;
    private static EMAIL_REGEX = RegularExp.EMAIL_REGEX;
    private static PHONE_REGEX = RegularExp.PHONE_REGEX;

    public static validate(input: any): [CreateSupplierRequestDto?, string?] {

        if ( !input.name || input.name.trim().length === 0 ) {
            return [undefined, 'El nombre del proveedor es obligatorio']
        } else if ( input.name.length > this.MAX_NAME_LENGTH ) {
            return [undefined, `El nombre no puede exceder ${this.MAX_NAME_LENGTH} caracteres`]
        }

        if (!input.lastname || input.lastname.trim().length === 0) {
            return [undefined, 'El apellido es obligatorio'];
        } else if (input.lastname.length > this.MAX_LASTNAME_LENGTH) {
            return [undefined, `El apellido no puede exceder ${this.MAX_LASTNAME_LENGTH} caracteres`];
        }

        if (!input.email || input.email.trim().length === 0) {
            return [undefined, 'El email es obligatorio'];
        } else if (!this.EMAIL_REGEX.test(input.email)) {
            return [undefined, 'El email no es válido'];
        }

        if (!input.phone || input.phone.trim().length === 0) {
            return [undefined, 'El teléfono es obligatorio'];
        } else if (!this.PHONE_REGEX.test(input.phone)) {
            return [undefined, 'El teléfono no es válido'];
        }

        if (!input.company || input.company.trim().length === 0) {
            return [undefined, 'La empresa es obligatoria'];
        } else if (input.company.length > this.MAX_COMPANY_LENGTH) {
            return [undefined, `La empresa no puede exceder ${this.MAX_COMPANY_LENGTH} caracteres`];
        }

        return [{
            name: input.name.trim(),
            lastname: input.lastname.trim(),
            company: input.company.trim(),
            email: input.email.trim(),
            phone: input.phone.trim()
        }]

    }

}