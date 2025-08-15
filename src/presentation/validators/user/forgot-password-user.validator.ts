import { ForgotPasswordRequestI } from "../../../application/dtos/user.dto";
import { RegularExp } from "../../../config/utils";

export class ForgotPasswordUserValidator {

    private static EMAIL_REGEX = RegularExp.EMAIL_REGEX;

    public static validate( input: any ): [ ForgotPasswordRequestI?, string? ] {

        if (!input.email || input.email.trim().length === 0) {
            return [undefined, 'El email es obligatorio'];
        } else if (!this.EMAIL_REGEX.test(input.email)) {
            return [undefined, 'El email no es válido'];
        }

        return [{
            email: input.email.trim()
        }]

    }

}