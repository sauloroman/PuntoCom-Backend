import { ResetPasswordCodeDatasource } from "../../../domain/datasources";
import { PasswordResetCode } from "../../../domain/entities";
import { CodeValue } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { MssqlClient } from "./mssql-client";

export class MSSQLResetPasswordCode implements ResetPasswordCodeDatasource {

    private toDomain(resetPassCode: any): PasswordResetCode {
        return new PasswordResetCode({
            resetId: resetPassCode.reset_id,
            code: new CodeValue(resetPassCode.code),
            createdAt: resetPassCode.createdAt,
            expiresAt: resetPassCode.expiresAt,
            userId: resetPassCode.user_id
        })
    }

    async save(resetPassCode: PasswordResetCode): Promise<PasswordResetCode> {
        try {

            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('reset_id', resetPassCode.id )
                .input('code', resetPassCode.code.value )
                .input('expiresAt', resetPassCode.expiresAt )
                .input('createdAt', resetPassCode.createdAt)
                .input('user_id', resetPassCode.userId )
                .query(`
                    INSERT INTO PasswordResetCode
                    (
                        reset_id,
                        code,
                        expiresAt,
                        createdAt,
                        used,
                        user_id
                    )   
                    OUTPUT INSERTED.*
                    VALUES (
                        @reset_id,
                        @code,
                        @expiresAt,
                        @createdAt,
                        0,
                        @user_id
                    )
                `)

            return this.toDomain( result.recordset[0] )

        } catch (error) {
            throw new InfrastructureError(
                'Error al crear el código para recuperar contraseña',
                'MSSQL_CREATE_RESET_PASSWORD_CODE',
                error
            )
        }
    }

    async findByCode(code: string): Promise<PasswordResetCode | null> {
        try {

            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('code', code)
                .query(`
                    SELECT *
                    FROM PasswordResetCode
                    WHERE code = @code
                `)
            
            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener el código para recuperar contraseña',
                'MSSQL_GET_RESET_PASSWORD_CODE',
                error
            )
        }
    }
    
    async deleteAllCodesByUserId(userId: string): Promise<void> {
        try {
            
            const pool = await MssqlClient.getConnection()

            await pool.request()
                .input('user_id', userId )
                .query(`
                    DELETE FROM PasswordResetCode
                    WHERE user_id = @user_id    
                `)

        } catch( error ) {
            throw new InfrastructureError(
                'Error al eliminar los códigos para recuperar contraseña asociados a este usuario',
                'MSSQL_DELETE_RESET_PASSWORD_CODES',
                error
            )
        }
    }
}