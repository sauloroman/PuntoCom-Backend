import { PasswordResetCode } from "../../../../domain/entities";
import { CodeValue } from "../../../../domain/value-objects";

export class PasswordResetCodeMapper {

    public static fromSQL(resetPassCode: any): PasswordResetCode {
        return new PasswordResetCode({
            resetId: resetPassCode.reset_id,
            code: new CodeValue(resetPassCode.code),
            createdAt: resetPassCode.createdAt,
            expiresAt: resetPassCode.expiresAt,
            userId: resetPassCode.user_id
        })
    }

}