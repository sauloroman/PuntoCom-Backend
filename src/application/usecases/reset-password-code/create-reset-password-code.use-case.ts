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

        let resetPassCodeValue = CodeGeneratorAdapter.generateNumericCode(this.CODE_LENGTH)

        const createdAt = DatesAdapter.now()
        const expiresAt = DatesAdapter.addMinutes( createdAt, 15 )

        const resetPassCode = new PasswordResetCode({
            code: new CodeValue( resetPassCodeValue ),
            createdAt: createdAt,
            expiresAt: expiresAt,
            userId: userId
        }) 

        const code = await this.resetPassCodeDatasource.save( resetPassCode )

        return {
            id: code.id,
            code: code.code.value,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(code.createdAt) ),
            expiresAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(code.expiresAt) ),
            userId: code.userId
        }

    }

}