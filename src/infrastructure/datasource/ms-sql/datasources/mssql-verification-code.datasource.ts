import { ConnectionPool } from "mssql";
import { VerificationCodeDatasource } from "../../../../domain/datasources";
import { VerificationCode } from "../../../../domain/entities";
import { InfrastructureError } from "../../../errors/infrastructure-error";
import { VerificationCodeMapper } from "../mappers/verification-code.mapper";

export class MSSQLVerificationCode implements VerificationCodeDatasource {
    
    constructor(private readonly pool: ConnectionPool){}

    async deleteAllCodesByUserId(userId: string): Promise<void> {
        try {
            await this.pool.request()
                .input('user_id', userId)
                .query(`
                    DELETE FROM VerificationCode
                    WHERE user_id = @user_id   
                `)

        } catch( error ) {
            throw new InfrastructureError(
                'Error al eliminar los codigos de verificacion para este usuario',
                'MSSQL_GET_VERIFICATION_CODE_ERROR',
                error
            )
        }
    }
    
    async findByCode(verificationCode: string): Promise<VerificationCode | null> {
        try {
            const result = await this.pool.request()
                .input('code', verificationCode)
                .query(`
                    SELECT *
                    FROM VerificationCode
                    WHERE code = @code    
                `)
            
            if ( !result.recordset[0] ) return null
            return VerificationCodeMapper.fromSQL( result.recordset[0] )

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener el codigo de verificacion',
                'MSSQL_GET_VERIFICATION_CODE_ERROR',
                error
            )
        }
    }
    
    async save(verificationCode: VerificationCode): Promise<void> {
        try {
            await this.pool.request()
                .input('verification_id', verificationCode.id)
                .input('code', verificationCode.code.value )
                .input('expiresAt', verificationCode.expiresAt)
                .input('createdAt', verificationCode.createdAt)
                .input('user_id', verificationCode.userId )
                .query(`
                    INSERT INTO VerificationCode
                    (
                        verification_id,
                        code,
                        expiresAt,
                        createdAt,
                        user_id
                    )
                    OUTPUT INSERTED.*
                    VALUES
                    (
                        @verification_id,
                        @code,
                        @expiresAt,
                        @createdAt,
                        @user_id
                    )
                `)

        } catch ( error ) {
            throw new InfrastructureError(
                'Error al crear el codigo de verificacion',
                'MSSQL_CREATE_VERIFICATION_CODE_ERROR',
                error
            )
        }
    }

}