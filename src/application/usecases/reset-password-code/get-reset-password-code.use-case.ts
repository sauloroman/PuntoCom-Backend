import { DatesAdapter } from "../../../config/plugins";
import { ResetPasswordCodeRepository } from "../../../domain/repositories";
import { GetResetPassCodeRequest, ResetPassCodeResponse } from "../../dtos/reset-pass-code.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetPasswordResetCodeUseCase {

    private readonly MESSAGE_ERROR: string = "GET_RESET_PASSWORD_CODE_ERROR"

    constructor( private readonly passwordResetCodeRepository: ResetPasswordCodeRepository ){}

    public async execute( data: GetResetPassCodeRequest ): Promise<ResetPassCodeResponse> {

        const { code } = data

        const resetPasswordCode = await this.passwordResetCodeRepository.findByCode( code )
        if ( !resetPasswordCode ) throw new ApplicationError(`El código de verificación ${code} no existe`, this.MESSAGE_ERROR )
        
        return {
            id: resetPasswordCode.id,
            code: resetPasswordCode.code.value,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(resetPasswordCode.createdAt) ),
            expiresAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(resetPasswordCode.expiresAt)),
            userId: resetPasswordCode.userId
        }

    }


}