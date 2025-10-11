import { ValidateResetPassCode } from "../../../application/dtos/reset-pass-code.dto";
import { RegularExp } from "../../../config/utils";

export class PasswordResetCodeValidator {

    private static EMAIL_REGEX = RegularExp.EMAIL_REGEX;
    private static MAX_CODE_LENGTH: number = 6

    public static validate( input: any ): [ ValidateResetPassCode?, string? ] {

        if (!input.code || input.code.trim().length === 0) {
            return [undefined, 'El código es obligatorio'];
        } else if (input.code.length > this.MAX_CODE_LENGTH) {
            return [undefined, `El código no puede exceder ${this.MAX_CODE_LENGTH} caracteres`];
        }

        if (!input.email || input.email.trim().length === 0) {
            return [undefined, 'El email es obligatorio'];
        } else if (!this.EMAIL_REGEX.test(input.email)) {
            return [undefined, 'El email no es válido'];
        }

        return [
            {
                code: input.code.trim(),
                email: input.email.trim(),
            }
        ]

    }

}