import { ValidateUserRequestI } from "../../../application/dtos/user.dto";

export class ValidateUserValidator {

    private static MAX_CODE_LENGTH: number = 6

    public static validate(input: any): [ValidateUserRequestI?, string?] {

        if (!input.code || input.code.trim().length === 0) {
            return [undefined, 'El código es obligatorio'];
        } else if (input.code.length > this.MAX_CODE_LENGTH) {
            return [undefined, `El código no puede exceder ${this.MAX_CODE_LENGTH} caracteres`];
        }

        if (!input.token || !input.token.length ) {
            return [undefined, 'El token es obligatorio']
        }

        return [{
            token: input.token.trim(),
            code: input.code.trim()
        }];
    }
}
