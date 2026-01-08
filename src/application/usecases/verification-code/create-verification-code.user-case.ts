import { DatesAdapter, IDAdapter, CodeGeneratorAdapter } from '../../../config/plugins';
import { CreateVerificationCodeRequest, VerificationCodeResponseI } from '../../dtos/verification-code.dto'
import { VerificationCodeRepository } from '../../../domain/repositories';
import { VerificationCode } from '../../../domain/entities';
import { CodeValue } from '../../../domain/value-objects';

export class CreateVerificationCodeUseCase {

  private readonly CODE_LENGTH = 6

  constructor( private readonly verificationCodeRepository: VerificationCodeRepository ){}

  public async execute( data: CreateVerificationCodeRequest ): Promise<VerificationCodeResponseI> {

    const { userId } = data

    await this.verificationCodeRepository.deleteAllCodesByUserId(userId)
    
    let verificationCodeValue = CodeGeneratorAdapter.generateNumericCode(this.CODE_LENGTH)

    const createdAt = DatesAdapter.now()
    const expiresAt = DatesAdapter.addMinutes( createdAt, 10 )

    const verificationCode = new VerificationCode({
      id: IDAdapter.generate(),
      code: new CodeValue( verificationCodeValue ),
      createdAt: createdAt,
      expiresAt: expiresAt, 
      userId: userId
    })

    await this.verificationCodeRepository.save(verificationCode)

    return {
      id: verificationCode.id,
      code: verificationCode.code.value,
      createdAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(verificationCode.createdAt)),
      expiresAt: DatesAdapter.formatLocal(DatesAdapter.toLocal(verificationCode.expiresAt)),
      userId: verificationCode.userId
    }  
  }

}