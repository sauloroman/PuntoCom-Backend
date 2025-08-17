import { ResendVerificationCodeRequestI } from "../../../application/dtos/user.dto";
import { RegularExp } from "../../../config/utils";

export class ResendVerificationCodeValidator {

    private static EMAIL_REGEX = RegularExp.EMAIL_REGEX

    public static validate( input: any ): [ResendVerificationCodeRequestI?, string?] {

        if ( !input.email.trim() || input.email.trim().length === 0 ) {
            return [ undefined, 'El email es obligatorio']
        } else if ( !this.EMAIL_REGEX.test(input.email.trim()) ) {
            return [ undefined, 'El email no es válido']
        }

        return [{ email: input.email.trim() }]

    }

}