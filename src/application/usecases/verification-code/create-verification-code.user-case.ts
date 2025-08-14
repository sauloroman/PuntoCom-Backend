import { CreateVerificationCodeRequest, CreateVerificationCodeResponse } from '../../dtos/verification-code/create-verification-code.dto'
import { DatesAdapter, IDAdapter, CodeGeneratorAdapter } from '../../../config/plugins';

import { VerificationCodeRepository } from '../../../domain/repositories/verification-code.repository';
import { VerificationCode } from '../../../domain/entities/VerificationCode';
import { VerificationCodeValue } from '../../../domain/value-objects/VerificationCodeValue';

export class CreateVerificationCodeUseCase {

  private readonly CODE_LENGTH = 6

  constructor( private readonly verificationCodeRepository: VerificationCodeRepository ){}

  public async execute( data: CreateVerificationCodeRequest ): Promise<CreateVerificationCodeResponse> {

    const { userId } = data

    await this.verificationCodeRepository.deleteAllCodesByUserId(userId)
    
    let verificationCodeValue = ''
    do {
      verificationCodeValue = CodeGeneratorAdapter.generateNumericCode(this.CODE_LENGTH)
    } while( await this.verificationCodeRepository.findByCode(verificationCodeValue) )

    const createdAt = DatesAdapter.now()
    const expiresAt = DatesAdapter.addMinutes( createdAt, 10 )

    const verificationCode = new VerificationCode({
      id: IDAdapter.generate(),
      code: new VerificationCodeValue( verificationCodeValue ),
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