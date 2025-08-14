import { LoginUserRequestI } from "../../../application/dtos/user.dto";
import { RegularExp } from "../../../config/utils";

export class LoginUserValidator {

    public static validate( input: any ): [LoginUserRequestI?, string?] {

        if (!input.email || input.email.trim().length === 0) {
            return [undefined, 'El correo es obligatorio'];
        } else if ( !RegularExp.EMAIL_REGEX.test( input.email )) {
            return [undefined, 'El correo no es válido'];
        }

        if (!input.password || input.password.trim().length === 0) {
            return [undefined, 'La contraseña es obligatorio'];
        }

        return [{
            email: input.email.trim(),
            password: input.password.trim()
        }]

    }

}