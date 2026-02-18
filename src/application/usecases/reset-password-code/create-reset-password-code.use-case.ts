import { CodeGeneratorAdapter, DatesAdapter, IDAdapter } from "../../../config/plugins";
import { ResetPasswordCodeDatasource } from "../../../domain/datasources";
import { PasswordResetCode } from "../../../domain/entities";
import { CodeValue } from "../../../domain/value-objects";
import { CreateResetPassCodeRequest, ResetPassCodeResponse } from "../../dtos/reset-pass-code.dto";

export class CreateResetPassCodeUseCase {

    private readonly CODE_LENGTH = 6

    constructor(private readonly resetPassCodeDatasource: ResetPasswordCodeDatasource){}

    public async execute( data: CreateResetPassCodeRequest ): Promise<ResetPassCodeResponse> {

        const { userId } = data
        
        await this.resetPassCodeDatasource.deleteAllCodesByUserId(userId)

        const resetPassCodeValue = await this.generateUniqueCode()
        const createdAt = DatesAdapter.now()
        const expiresAt = DatesAdapter.addMinutes( createdAt, 15 )

        const resetPassCode = new PasswordResetCode({
            resetId: IDAdapter.generate(),
            code: new CodeValue( resetPassCodeValue ),
            createdAt: createdAt,
            expiresAt: expiresAt,
            userId: userId
        }) 

        await this.resetPassCodeDatasource.save( resetPassCode )

        return {
            id: resetPassCode.id,
            code: resetPassCode.code.value,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(resetPassCode.createdAt) ),
            expiresAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(resetPassCode.expiresAt) ),
            userId: resetPassCode.userId
        }

    }

    private async generateUniqueCode(): Promise<string> {
        let resetPasswordCode = ''
        let existingCode: PasswordResetCode | null = null

        do {
            resetPasswordCode = CodeGeneratorAdapter.generateNumericCode(this.CODE_LENGTH)
            existingCode = await this.resetPassCodeDatasource.findByCode( resetPasswordCode )
        } while( existingCode )

        return resetPasswordCode
    }

}