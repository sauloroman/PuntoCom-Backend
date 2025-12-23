import { RoleEnum } from "../../../../generated/prisma";
import { UpdateUserRequestI } from "../../../application/dtos/user.dto";

export class UpdateUserValidator {

    private static MAX_NAME_LENGTH = 60;
    private static MAX_LASTNAME_LENGTH = 60;
    private static MAX_PHONE_LENGTH = 12;

    public static validate( input: any ): [ UpdateUserRequestI?, string? ] {

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

        if ( input.phone && input.phone.trim().length > 0 ) {
            if (input.phone.length > this.MAX_PHONE_LENGTH) {
                return [undefined, `El número de teléfono no puede exceder ${this.MAX_PHONE_LENGTH} caracteres`];
            }
        }

        if ( input.role && input.role.length > 0 ) {
            if ( !Object.values(RoleEnum).includes(input.role)) {
                return [undefined, 'El rol proporcionado no es válido'];
            }
        }

        return [
            {
                name: input.name ? input.name.trim() : undefined,
                lastname: input.lastname ? input.lastname.trim() : undefined,
                role: input.role ? input.role.trim() : undefined,
                phone: input.phone ? input.phone.trim() : undefined
            }
        ]

    }
 
}