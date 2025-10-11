import { ChangePasswordMobileRequestDtoI} from "../../../application/dtos/user.dto";
import { RegularExp } from "../../../config/utils";

export class ChangePasswordMobileValidator {

    private static PASSWORD_REGEX = RegularExp.PASSWORD_REGEX;

    public static validate(input: any): [ChangePasswordMobileRequestDtoI?, string?] {

        if (!input.newPassword || input.newPassword.trim().length === 0) {
            return [undefined, 'La nueva contraseña es obligatoria'];
        } else if (!this.PASSWORD_REGEX.test(input.newPassword)) {
            return [undefined, 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un caracter especial'];
        }

        return [{
            newPassword: input.newPassword.trim()
        }];

    }

}