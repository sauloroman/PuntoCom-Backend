import { VerificationCodeDatasource } from "../../domain/datasources/verification-code.datasource";
import { VerificationCode } from "../../domain/entities/VerificationCode";
import { VerificationCodeRepository } from "../../domain/repositories/verification-code.repository";

export class VerificationCodeRepositoryImpl implements VerificationCodeRepository {
  
  constructor(private readonly verificationCodeDataSource: VerificationCodeDatasource ){}
  
  async findByCode(verificationCode: string): Promise<VerificationCode | null> {
    return await this.verificationCodeDataSource.findByCode( verificationCode )
  }

  async deleteAllCodesByUserId(userId: string): Promise<void> {
    await this.verificationCodeDataSource.deleteAllCodesByUserId(userId)
  }

  async save(verificationCode: VerificationCode): Promise<void> {
    await this.verificationCodeDataSource.save( verificationCode )
  }

}