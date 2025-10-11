import { ResetPasswordCodeDatasource } from "../../domain/datasources/reset-password-code.datasource";
import { PasswordResetCode } from "../../domain/entities";
import { ResetPasswordCodeRepository } from "../../domain/repositories/reset-pass-code.repository";

export class ResetPassCodeImpl implements ResetPasswordCodeRepository {
    
    constructor(private readonly resetPassCodeDatasource: ResetPasswordCodeDatasource){}

    public async save(resetPassCode: PasswordResetCode): Promise<PasswordResetCode> {
        return await this.resetPassCodeDatasource.save( resetPassCode )
    }
    
    public async findByCode(code: string): Promise<PasswordResetCode | null> {
        return await this.resetPassCodeDatasource.findByCode(code)
    }
    
    public async deleteAllCodesByUserId(userId: string): Promise<void> {
        return await this.resetPassCodeDatasource.deleteAllCodesByUserId(userId)
    }

}