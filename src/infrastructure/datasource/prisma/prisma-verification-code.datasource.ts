import { VerificationCodeDatasource } from "../../../domain/datasources/verification-code.datasource";
import { VerificationCode } from '../../../domain/entities/VerificationCode';
import { PrismaClient, VerificationCode as PrismaVerificationCode} from "../../../../generated/prisma";
import { InfrastructureError } from '../../errors/infrastructure-error';
import { VerificationCodeValue } from "../../../domain/value-objects/VerificationCodeValue";

export class PrismaVerificationCodeDatasource implements VerificationCodeDatasource {

  constructor(private readonly prismaClient: PrismaClient){}

  async findByCode(verificationCode: string): Promise<VerificationCode | null> {
    try {
      const code = await this.prismaClient.verificationCode.findUnique({ where: { code: verificationCode }})
      if ( !code ) return null
      return this.toDomain( code )
    } catch( error ) {
      throw new InfrastructureError(
        '[Prisma]: Error obtener el código de verificación',
        'PRISMA_CREATE_VERIFICATION_CODE',
        error
      )
    }
  }

  async deleteAllCodesByUserId(userId: string): Promise<void> {
    try {
      await this.prismaClient.verificationCode.deleteMany({ where: { user_id: userId }})
    } catch( error ) {
      throw new InfrastructureError(
        `[Prisma]: Error al eliminar código de verificación asociados al usuario: ${userId}`,
        'PRISMA_CREATE_VERIFICATION_CODE',
        error
      )
    }
  }

  async save(verificationCode: VerificationCode): Promise<void> {
    try {
      await this.prismaClient.verificationCode.create({ data: this.toPrisma(verificationCode) })
    } catch( error ) {
      throw new InfrastructureError(
        '[Prisma]: Error al crear el código de verificación',
        'PRISMA_CREATE_VERIFICATION_CODE',
        error
      )
    }
  }

  private toDomain( verificationCode: PrismaVerificationCode ): VerificationCode {
    return new VerificationCode({
      id: verificationCode.verification_id,
      code: new VerificationCodeValue(verificationCode.code),
      createdAt: verificationCode.createdAt,
      expiresAt: verificationCode.expiresAt,
      userId: verificationCode.user_id
    })
  }

  private toPrisma( verificationCode: VerificationCode ): Omit<PrismaVerificationCode, 'verification_id'> {
    return {
      code: verificationCode.code.value,
      createdAt: verificationCode.createdAt,
      expiresAt: verificationCode.expiresAt,
      user_id: verificationCode.userId
    }
  }

}