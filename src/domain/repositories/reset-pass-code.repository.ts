import { PasswordResetCode } from "../entities";

export abstract class ResetPasswordCodeRepository {
    abstract save( resetPassCode: PasswordResetCode ): Promise<PasswordResetCode>
    abstract findByCode( code: string ): Promise<PasswordResetCode | null>
    abstract deleteAllCodesByUserId( userId: string ): Promise<void>
}