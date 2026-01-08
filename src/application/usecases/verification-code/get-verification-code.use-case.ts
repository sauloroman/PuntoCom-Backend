import { DatesAdapter } from "../../../config/plugins";
import { VerificationCodeRepository } from "../../../domain/repositories";
import { GetVerificationCodeRequestI, VerificationCodeResponseI } from "../../dtos/verification-code.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetVerificationCodeUseCase {

    private readonly MESSAGE_ERROR: string = "GET_VALIDATION_CODE_ERROR"

    constructor( private readonly verificationCodeRepository: VerificationCodeRepository ){}

    public async execute( data: GetVerificationCodeRequestI ): Promise<VerificationCodeResponseI> {

        const { code } = data

        const verificationCode = await this.verificationCodeRepository.findByCode( code ) 
        if ( !verificationCode )  throw new ApplicationError(`El código de verificacion ${code} no existe`, this.MESSAGE_ERROR)

        return {
            id: verificationCode.id,
            code: verificationCode.code.value,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(verificationCode.createdAt) ),
            expiresAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(verificationCode.expiresAt) ),
            userId: verificationCode.userId
        }

    }

}