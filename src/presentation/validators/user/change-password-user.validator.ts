import { ChangePasswordRequestDtoI } from "../../../application/dtos/user.dto";
import { RegularExp } from "../../../config/utils";

export class ChangePasswordValidator {

    private static PASSWORD_REGEX = RegularExp.PASSWORD_REGEX;

    public static validate( input: any ): [ChangePasswordRequestDtoI?, string?] {

        if (!input.newPassword || input.newPassword.trim().length === 0) {
            return [undefined, 'La nueva contraseña es obligatoria'];
        } else if (!this.PASSWORD_REGEX.test(input.newPassword)) {
            return [undefined, 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un caracter especial'];
        }

        if ( !input.code || input.code.trim().length === 0 ) {
            return [undefined, 'El código es obligatorio']
        }

        if (!input.token || !input.token.length ) {
            return [undefined, 'El token es obligatorio']
        }

        return [{
            token: input.token.trim(),
            newPassword: input.newPassword.trim(),
            code: input.code.trim()
        }];

    }

}