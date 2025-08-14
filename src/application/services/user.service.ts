import { CreateUserUseCase, GetUserUseCase, ChangeStatusUserUseCase, ValidateUserUseCase, LoginUserUseCase } from '../usecases/user';
import { CreateVerificationCodeUseCase, GetVerificationCodeUseCase } from '../usecases/verification-code';
import { SendDeactivationAccountEmailUseCase, SendVerificationCodeEmailUseCase } from '../usecases/email';
import { JwtAdapter, DatesAdapter } from '../../config/plugins';

export class UserService {
  constructor(
    private readonly createUserUC: CreateUserUseCase,
    private readonly getUserUC: GetUserUseCase,
    private readonly changeStatusUC: ChangeStatusUserUseCase,
    private readonly validateUserUC: ValidateUserUseCase,
    private readonly loginUserUC: LoginUserUseCase,
    private readonly createVerificationCodeUC: CreateVerificationCodeUseCase,
    private readonly getVerificationCodeUC: GetVerificationCodeUseCase,
    private readonly sendDeactivationEmailUC: SendDeactivationAccountEmailUseCase,
    private readonly sendVerificationCodeEmailUC: SendVerificationCodeEmailUseCase
  ) {}

  async registerUser(dto: any) {
    const user = await this.createUserUC.execute(dto)
    const verificationCode = await this.createVerificationCodeUC.execute({ userId: user.id })
    const token = await JwtAdapter.generateJWT({ id: user.id }) as string
    await this.sendVerificationCodeEmailUC.execute({
      token,
      userEmail: user.email,
      username: `${user.name} ${user.lastname}`,
      verificationCode: verificationCode.code
    })
    return { user, token }
  }

  async validateUser(token: string, code: string) {
    const payload = await JwtAdapter.validateToken<{id: string}>(token)
    const userId = payload!.id
    const verificationCode = await this.getVerificationCodeUC.execute({ code })

    if (verificationCode.userId !== userId) throw new Error("El código no corresponde con el usuario")
    if (DatesAdapter.isExpired(new Date(verificationCode.expiresAt), 10)) {
      throw new Error("El código ha expirado. Solicita uno nuevo.")
    }

    const user = await this.validateUserUC.execute({ userId })
    return user
  }

  async loginUser(email: string, password: string) {
    const user = await this.loginUserUC.execute({ email, password })
    const token = await JwtAdapter.generateJWT({ id: user.id })
    return { user, token }
  }

  async deactivateUser(userId: string) {
    const user = await this.changeStatusUC.execute({ userId }, false)
    await this.sendDeactivationEmailUC.execute({ userEmail: user.email, username: user.name })
    return user
  }

  async activateUser(userId: string) {
    return await this.changeStatusUC.execute({ userId }, true)
  }

  async getUserById(userId: string) {
    return await this.getUserUC.execute({ id: userId })
  }
}
