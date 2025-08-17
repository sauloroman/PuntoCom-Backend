import { JwtAdapter, DatesAdapter } from '../../config/plugins';
import { CreateUserUseCase, GetUserByIdUseCase, ChangeStatusUserUseCase, ValidateUserUseCase, LoginUserUseCase, GetUserByEmailUseCase, ChangePasswordUseCase } from '../usecases/user';
import { CreateVerificationCodeUseCase, GetVerificationCodeUseCase } from '../usecases/verification-code';
import { SendChangePasswordEmailUseCase, SendDeactivationAccountEmailUseCase, SendForgotPasswordEmailUseCase, SendVerificationCodeEmailUseCase } from '../usecases/email';
import { ApplicationError } from '../errors/application.error';
import { UpdateUserUseCase } from '../usecases/user/update-user.use-case';
import { ChangePasswordRequestDtoI, CreateUserRequestDtoI, ForgotPasswordRequestI, ResendVerificationCodeRequestI, UpdateUserRequestDTOI } from '../dtos/user.dto';
import { User } from '../../domain/entities';

interface UserServiceI {
  createUserUC: CreateUserUseCase
  getUserByIdUC: GetUserByIdUseCase,
  getUserByEmailUC: GetUserByEmailUseCase
  changeStatusUC: ChangeStatusUserUseCase
  validateUserUC: ValidateUserUseCase
  updateUserUC: UpdateUserUseCase
  loginUserUC: LoginUserUseCase,
  changePasswordUserUC: ChangePasswordUseCase,

  createVerificationCodeUC: CreateVerificationCodeUseCase
  getVerificationCodeUC: GetVerificationCodeUseCase
  
  sendDeactivationEmailUC: SendDeactivationAccountEmailUseCase
  sendVerificationCodeEmailUC: SendVerificationCodeEmailUseCase
  sendForgotPasswordEmailUC: SendForgotPasswordEmailUseCase
  sendChangePasswordEmaiUC: SendChangePasswordEmailUseCase
}

export class UserService {
  
  private readonly createUserUC: CreateUserUseCase
  private readonly getUserByIdUC: GetUserByIdUseCase
  private readonly getUserByEmailUC: GetUserByEmailUseCase
  private readonly changeStatusUC: ChangeStatusUserUseCase
  private readonly validateUserUC: ValidateUserUseCase
  private readonly updateUserUC: UpdateUserUseCase
  private readonly loginUserUC: LoginUserUseCase
  private readonly changePasswordUserUC: ChangePasswordUseCase
  
  private readonly createVerificationCodeUC: CreateVerificationCodeUseCase
  private readonly getVerificationCodeUC: GetVerificationCodeUseCase

  private readonly sendDeactivationEmailUC: SendDeactivationAccountEmailUseCase
  private readonly sendVerificationCodeEmailUC: SendVerificationCodeEmailUseCase
  private readonly sendForgotPasswordEmailUC: SendForgotPasswordEmailUseCase
  private readonly sendChangePasswordEmaiUC: SendChangePasswordEmailUseCase

  constructor({
    createUserUC,
    getUserByIdUC,
    getUserByEmailUC,
    changeStatusUC,
    validateUserUC,
    updateUserUC,
    loginUserUC,
    changePasswordUserUC,
    createVerificationCodeUC,
    getVerificationCodeUC,
    sendDeactivationEmailUC,
    sendVerificationCodeEmailUC,
    sendForgotPasswordEmailUC,
    sendChangePasswordEmaiUC
  }: UserServiceI) {
    this.createUserUC = createUserUC
    this.getUserByIdUC = getUserByIdUC
    this.getUserByEmailUC = getUserByEmailUC
    this.changeStatusUC = changeStatusUC
    this.validateUserUC = validateUserUC
    this.updateUserUC = updateUserUC
    this.loginUserUC = loginUserUC
    this.changePasswordUserUC = changePasswordUserUC
    this.createVerificationCodeUC = createVerificationCodeUC
    this.getVerificationCodeUC = getVerificationCodeUC
    this.sendDeactivationEmailUC = sendDeactivationEmailUC
    this.sendVerificationCodeEmailUC = sendVerificationCodeEmailUC
    this.sendForgotPasswordEmailUC = sendForgotPasswordEmailUC
    this.sendChangePasswordEmaiUC = sendChangePasswordEmaiUC
  }

  async registerUser(dto: CreateUserRequestDtoI) {
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

  async resendVerificationCode( dto: ResendVerificationCodeRequestI ) {
    
    const user = await this.getUserByEmail( dto!.email )
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

  async updateUser(dto: UpdateUserRequestDTOI) {
    return await this.updateUserUC.execute( dto )
  }

  async validateUser( token: string, code: string) {
    const payload = await JwtAdapter.validateToken<{id: string}>(token)
    const userId = payload!.id
    
    const verificationCode = await this.getVerificationCodeUC.execute({ code })

    if (verificationCode.userId !== userId) throw new ApplicationError("El código no corresponde con el usuario")
    if (DatesAdapter.isExpired(new Date(verificationCode.expiresAt), 10)) {
      throw new ApplicationError("El código ha expirado. Solicita uno nuevo.")
    }

    const user = await this.validateUserUC.execute({ userId })
    return user
  }

  async loginUser(email: string, password: string) {
    const user = await this.loginUserUC.execute({ email, password })
    const token = await JwtAdapter.generateJWT({ id: user.id, email: user.email, role: user.role })
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

  async forgotPassword( dto: ForgotPasswordRequestI ) {
    const user = await this.getUserByEmail(dto?.email!)
    const token = await JwtAdapter.generateJWT({ id: user.id }) as string

    await this.sendForgotPasswordEmailUC.execute({
      userEmail: user.email, 
      token,
      username: user.name
    })
  }

  async changePassword( dto: ChangePasswordRequestDtoI ) {
    const payload = await JwtAdapter.validateToken<{ id: string }>( dto.token )
    const userId = payload!.id

    await this.changePasswordUserUC.execute({ id: userId, newPassword: dto.newPassword })
    const user = await this.getUserById(userId)
  
    await this.sendChangePasswordEmaiUC.execute({
      userEmail: user.email,
      username: user.name
    })
  }

  async getUserById(userId: string) {
    return await this.getUserByIdUC.execute({ id: userId })
  }

  async getUserByEmail(userEmail: string) {
    return await this.getUserByEmailUC.execute({ email: userEmail })
  }
}
