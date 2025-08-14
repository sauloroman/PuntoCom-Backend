import { VerificationCode } from '../entities/VerificationCode';

export abstract class VerificationCodeDatasource {
  abstract deleteAllCodesByUserId( userId: string ): Promise<void> 
  abstract findByCode( verificationCode: string ): Promise<VerificationCode | null>
  abstract save(verificationCode: VerificationCode): Promise<void>
}