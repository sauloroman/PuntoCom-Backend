import { CheckAdminPasswordDtoI } from "../../../application/dtos/user.dto";

export class CheckAdminPasswordValidator {

    public static validate( input: any ): [CheckAdminPasswordDtoI?, string?] {

        if ( !input.id || input.id.trim().length === 0 ) {
            return [undefined, 'El id del usuario es obligatorio']
        }  

        if ( !input.adminPassword || input.adminPassword.trim().length === 0 ) {
            return [undefined, 'La contraseña es obligatoria']
        }  

        return [{
            id: input.id.trim(),
            adminPassword: input.adminPassword.trim()
        }]

    }

}