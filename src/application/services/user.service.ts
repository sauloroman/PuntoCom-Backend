import { JwtAdapter, DatesAdapter } from '../../config/plugins';
import { 
  CreateUserUseCase, 
  GetUserByIdUseCase,
  ChangeStatusUserUseCase, 
  ValidateUserUseCase, 
  LoginUserUseCase, 
  GetUserByEmailUseCase, 
  ChangePasswordUseCase, 
  ListUsersUseCase, 
  UpdateUserImageUseCase,
  GetAllUsersUseCase,
  CheckAdminPasswordUseCase,
  UserIsValidatedUseCase} from '../usecases/user';
import { 
  CreateVerificationCodeUseCase, 
  GetVerificationCodeUseCase 
} from '../usecases/verification-code';
import { 
  SendChangePasswordEmailUseCase, 
  SendDeactivationAccountEmailUseCase,  
  SendForgotPasswordEmailUseCase,  
  SendVerificationCodeEmailUseCase 
} from '../usecases/email';
import { ApplicationError } from '../errors/application.error';
import { UpdateUserUseCase } from '../usecases/user/update-user.use-case';
import { 
  ChangePasswordRequestDtoI, 
  CheckAdminPasswordDtoI, 
  CreateUserRequestDtoI, 
  ForgotPasswordRequestI, 
  ResendVerificationCodeRequestI, 
  UpdateUserRequestDTOI } from '../dtos/user.dto';
  import { PaginationDTO } from '../dtos/pagination.dto';
  import { DestroyImageUseCase, UploadImageUseCase } from '../usecases/upload';
  import { UploadedFile } from 'express-fileupload';
  import { CreateResetPassCodeUseCase, GetPasswordResetCodeUseCase } from '../usecases/reset-password-code';

interface UserServiceI {
  createUserUC: CreateUserUseCase
  getUserByIdUC: GetUserByIdUseCase,
  getUserByEmailUC: GetUserByEmailUseCase
  getAllUsersUC: GetAllUsersUseCase
  changeStatusUC: ChangeStatusUserUseCase
  validateUserUC: ValidateUserUseCase
  updateUserUC: UpdateUserUseCase
  loginUserUC: LoginUserUseCase,
  changePasswordUserUC: ChangePasswordUseCase
  updateUserImageUC: UpdateUserImageUseCase
  listUsersUC: ListUsersUseCase
  checkAdminPasswordUC: CheckAdminPasswordUseCase,
  userIsValidatedUC: UserIsValidatedUseCase,

  createResetPassCodeUC: CreateResetPassCodeUseCase,
  getResetPassCodeUC: GetPasswordResetCodeUseCase,
  createVerificationCodeUC: CreateVerificationCodeUseCase
  getVerificationCodeUC: GetVerificationCodeUseCase
  
  sendDeactivationEmailUC: SendDeactivationAccountEmailUseCase
  sendVerificationCodeEmailUC: SendVerificationCodeEmailUseCase
  sendForgotPasswordEmailUC: SendForgotPasswordEmailUseCase
  sendChangePasswordEmaiUC: SendChangePasswordEmailUseCase

  uploadUserImageUC: UploadImageUseCase
  destroyUserImageUC: DestroyImageUseCase
}

export class UserService {
  
  private readonly createUserUC: CreateUserUseCase
  private readonly getUserByIdUC: GetUserByIdUseCase
  private readonly getUserByEmailUC: GetUserByEmailUseCase
  private readonly getAllUsersUC: GetAllUsersUseCase
  private readonly changeStatusUC: ChangeStatusUserUseCase
  private readonly validateUserUC: ValidateUserUseCase
  private readonly updateUserUC: UpdateUserUseCase
  private readonly loginUserUC: LoginUserUseCase
  private readonly updateUserImageUC: UpdateUserImageUseCase
  private readonly changePasswordUserUC: ChangePasswordUseCase
  private readonly listUsersUC: ListUsersUseCase
  private readonly checkAdminPasswordUC: CheckAdminPasswordUseCase
  private readonly userIsValidatedUC: UserIsValidatedUseCase

  private readonly createResetPassCodeUC: CreateResetPassCodeUseCase
  private readonly createVerificationCodeUC: CreateVerificationCodeUseCase
  private readonly getVerificationCodeUC: GetVerificationCodeUseCase
  private readonly getResetPassCodeUC: GetPasswordResetCodeUseCase

  private readonly sendDeactivationEmailUC: SendDeactivationAccountEmailUseCase
  private readonly sendVerificationCodeEmailUC: SendVerificationCodeEmailUseCase
  private readonly sendForgotPasswordEmailUC: SendForgotPasswordEmailUseCase
  private readonly sendChangePasswordEmaiUC: SendChangePasswordEmailUseCase

  private readonly uploadUserImageUC: UploadImageUseCase
  private readonly destroyUserImageUC: DestroyImageUseCase

  constructor({
    createUserUC,
    getUserByIdUC,
    getUserByEmailUC,
    getAllUsersUC,
    changeStatusUC,
    validateUserUC,
    updateUserUC,
    loginUserUC,
    updateUserImageUC,
    changePasswordUserUC,
    listUsersUC,
    checkAdminPasswordUC,
    userIsValidatedUC,
    createResetPassCodeUC,
    createVerificationCodeUC,
    getVerificationCodeUC,
    getResetPassCodeUC,
    sendDeactivationEmailUC,
    sendVerificationCodeEmailUC,
    sendForgotPasswordEmailUC,
    sendChangePasswordEmaiUC,
    uploadUserImageUC,
    destroyUserImageUC,
  }: UserServiceI) {
    this.createUserUC = createUserUC
    this.getUserByIdUC = getUserByIdUC
    this.getUserByEmailUC = getUserByEmailUC
    this.getAllUsersUC = getAllUsersUC
    this.changeStatusUC = changeStatusUC
    this.validateUserUC = validateUserUC
    this.updateUserUC = updateUserUC
    this.updateUserImageUC = updateUserImageUC
    this.loginUserUC = loginUserUC
    this.changePasswordUserUC = changePasswordUserUC
    this.userIsValidatedUC = userIsValidatedUC
    this.listUsersUC = listUsersUC
    this.checkAdminPasswordUC = checkAdminPasswordUC
    this.createResetPassCodeUC = createResetPassCodeUC
    this.createVerificationCodeUC = createVerificationCodeUC
    this.getVerificationCodeUC = getVerificationCodeUC
    this.getResetPassCodeUC = getResetPassCodeUC
    this.sendDeactivationEmailUC = sendDeactivationEmailUC
    this.sendVerificationCodeEmailUC = sendVerificationCodeEmailUC
    this.sendForgotPasswordEmailUC = sendForgotPasswordEmailUC
    this.sendChangePasswordEmaiUC = sendChangePasswordEmaiUC
    this.uploadUserImageUC = uploadUserImageUC
    this.destroyUserImageUC = destroyUserImageUC
  }

  async checkAdminPassword( dto: CheckAdminPasswordDtoI ) {
    return await this.checkAdminPasswordUC.execute(dto)
  }

  async renewToken(userId: string) {
    const user = await this.getUserById(userId)
    const token = await JwtAdapter.generateJWT({ id: user.id, email: user.email, role: user.role})
    return {
      user, token
    }
  }

  async uploadUserImage( image: UploadedFile, userId: string ) {
    const user = await this.getUserById(userId) 
    if ( !user ) throw new ApplicationError(`El usuario con id ${userId} no existe`)

    if ( user.image !== 'Usuario sin imagen' ) {
      await this.destroyUserImageUC.execute(user.image)
    }  

    const urlImage = await this.uploadUserImageUC.execute("puntocom/users", image, userId)
    const updatedUser = await this.updateUserImageUC.execute({ id: user.id, url: urlImage })    
    return updatedUser
  }

  async listUsers( dto: PaginationDTO ) {
    return await this.listUsersUC.execute( dto )
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

    if ( await this.userIsValidatedUC.execute(dto.email) ) return

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
      
    if (DatesAdapter.isExpired(new Date(verificationCode.createdAt), 10)) {
      throw new ApplicationError("El código ha expirado. Solicita uno nuevo.")
    }

    const user = await this.validateUserUC.execute({ userId })
    const tokenSession = await JwtAdapter.generateJWT({ id: user.id, email: user.email, role: user.role })

    return {
      user, 
      token: tokenSession
    }
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
    const {code} = await this.createResetPassCodeUC.execute({ userId: user.id! })
    const token = await JwtAdapter.generateJWT({ id: user.id }) as string

    await this.sendForgotPasswordEmailUC.execute({
      userEmail: user.email, 
      username: user.name,
      token,
      code: code,
    })
  }

  async changePassword( dto: ChangePasswordRequestDtoI ) {
    const payload = await JwtAdapter.validateToken<{ id: string }>( dto.token )
    const userId = payload!.id

    const resetPassCode = await this.getResetPassCodeUC.execute({ code: dto.code })

    if ( resetPassCode.userId !== userId ) {
      throw new ApplicationError('El código no coincide con el usuario')
    }

    if (DatesAdapter.isExpired(new Date(resetPassCode.createdAt), 15)) {
      throw new ApplicationError("El código ha expirado. Solicita uno nuevo.")
    }

    const user = await this.changePasswordUserUC.execute({ id: userId, newPassword: dto.newPassword })

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

  async getAllUsers() {
    return await this.getAllUsersUC.execute()
  }
}
