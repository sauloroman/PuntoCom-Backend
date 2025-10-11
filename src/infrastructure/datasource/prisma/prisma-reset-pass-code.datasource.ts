import { ResetPasswordCodeDatasource } from "../../../domain/datasources/reset-password-code.datasource";
import { PasswordResetCode } from "../../../domain/entities";
import { PrismaClient, PasswordResetCode as PrismaPasswordResetCode } from '../../../../generated/prisma'
import { CodeValue } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";

export class PrismaResetPasswordCode implements ResetPasswordCodeDatasource {

    constructor(private readonly prismaClient: PrismaClient) { }

    public async save(resetPassCode: PasswordResetCode): Promise<PasswordResetCode> {
        try {
            const code = await this.prismaClient.passwordResetCode.create({
                data: this.toPrisma(resetPassCode)
            })
            return this.toDomain(code)
        } catch (error) {
            throw new InfrastructureError(
                '[Prisma]: Error al crear el código para recuperar contraseña',
                'PRISMA_CREATE_RESET_PASSWORD_CODE',
                error
            )
        }
    }

    public async findByCode(code: string): Promise<PasswordResetCode | null> {
        try {
            const resetPasswordCode = await this.prismaClient.passwordResetCode.findUnique({ where: { code }})
            if ( !resetPasswordCode ) return null
            return this.toDomain( resetPasswordCode )
        } catch (error) {
            throw new InfrastructureError(
                '[Prisma]: Error al obtener el código para recuperar contraseña por código',
                'PRISMA_GET_RESET_PASSWORD_CODE',
                error
            )
        }
    }

    public async deleteAllCodesByUserId(userId: string): Promise<void> {
        try {
           await this.prismaClient.passwordResetCode.findMany({ where: { user_id: userId }})
        } catch (error) {
            throw new InfrastructureError(
                `[Prisma]: Error al eliminar código de recuperación de contraseña asociados al usuario: ${userId}`,
                'PRISMA_DELETE_RESET_PASSWORD_CODES',
                error
            )
        }
    }

    private toDomain(resetPassCode: PrismaPasswordResetCode): PasswordResetCode {
        return new PasswordResetCode({
            resetId: resetPassCode.reset_id,
            code: new CodeValue(resetPassCode.code),
            createdAt: resetPassCode.createdAt,
            expiresAt: resetPassCode.expiresAt,
            userId: resetPassCode.user_id
        })
    }

    private toPrisma(resetPassCode: PasswordResetCode): Omit<PrismaPasswordResetCode, 'reset_id'> {
        return {
            code: resetPassCode.code.value,
            createdAt: resetPassCode.createdAt,
            expiresAt: resetPassCode.expiresAt,
            user_id: resetPassCode.userId
        }
    }


}