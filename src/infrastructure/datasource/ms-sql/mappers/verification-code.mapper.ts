import { VerificationCode } from "../../../../domain/entities";
import { CodeValue } from "../../../../domain/value-objects";

export class VerificationCodeMapper {

    public static fromSQL(verificationCode: any): VerificationCode {
        return new VerificationCode({
            id: verificationCode.verification_id,
            code: new CodeValue(verificationCode.code),
            createdAt: verificationCode.createdAt,
            expiresAt: verificationCode.expiresAt,
            userId: verificationCode.user_id
        })
    }

}