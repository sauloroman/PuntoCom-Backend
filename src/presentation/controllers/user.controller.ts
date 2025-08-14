import { JwtAdapter } from '../../config/plugins/jwt.plugin';
import { CreateUserUseCase, GetUserUseCase, ChangeStatusUserUseCase } from '../../application/usecases/user';
import { ValidationError } from '../../application/errors/validation.error';
import { SendDeactivationAccountEmailUseCase, SendVerificationCodeEmailUseCase } from '../../application/usecases/email';
import { CreateVerificationCodeUseCase, GetVerificationCodeUseCase } from '../../application/usecases/verification-code';
import { CreateUserValidator } from '../validators/user/create-user.validator';
import { Request, Response } from 'express';
import { ValidateUserValidator } from '../validators/user/validate-user.validator';
import { DatesAdapter } from '../../config/plugins';
import { ValidateUserUseCase } from '../../application/usecases/user/validate-user.use-case';

interface UserControllerI {
  createUserUseCase: CreateUserUseCase
  getUserUseCase: GetUserUseCase
  changeStatusUseCase: ChangeStatusUserUseCase
  validateUserUseCase: ValidateUserUseCase
  createVerificationCodeUseCase: CreateVerificationCodeUseCase
  getVerificationCodeUseCase: GetVerificationCodeUseCase
  sendDeactivationAccountEmailUseCase: SendDeactivationAccountEmailUseCase
  sendVerificationCodeEmailUseCase: SendVerificationCodeEmailUseCase
}

export class UserController {

  private readonly createUserUseCase: CreateUserUseCase;
  private readonly getUserUseCase: GetUserUseCase;
  private readonly changeStatusUseCase: ChangeStatusUserUseCase;
  private readonly validateUserUseCase: ValidateUserUseCase;
  private readonly createVerificationCodeUseCase: CreateVerificationCodeUseCase;
  private readonly getVerificationCodeUseCase: GetVerificationCodeUseCase
  private readonly sendDeactivationAccountEmailUseCase: SendDeactivationAccountEmailUseCase;
  private readonly sendVerificationCodeEmailUseCase: SendVerificationCodeEmailUseCase;

  constructor({
    changeStatusUseCase,
    createUserUseCase,
    validateUserUseCase,
    createVerificationCodeUseCase,
    getVerificationCodeUseCase,
    getUserUseCase, 
    sendDeactivationAccountEmailUseCase,
    sendVerificationCodeEmailUseCase
   }: UserControllerI) {
    this.changeStatusUseCase = changeStatusUseCase
    this.createUserUseCase = createUserUseCase
    this.validateUserUseCase = validateUserUseCase
    this.createVerificationCodeUseCase = createVerificationCodeUseCase
    this.getUserUseCase = getUserUseCase
    this.getVerificationCodeUseCase = getVerificationCodeUseCase
    this.sendDeactivationAccountEmailUseCase = sendDeactivationAccountEmailUseCase
    this.sendVerificationCodeEmailUseCase = sendVerificationCodeEmailUseCase
   }

  public createUser = async ( req: Request, res: Response ) => {
    const [ createUserDto, errorMessage ] = CreateUserValidator.validate(req.body) 
    if ( errorMessage ) throw new ValidationError(errorMessage, 'CREATE_USER_VALIDATION_ERROR');

    const createdUser = await this.createUserUseCase.execute( createUserDto! )

    const verificationCode = await this.createVerificationCodeUseCase.execute({userId: createdUser.id})

    const token = await JwtAdapter.generateJWT({ id: createdUser.id })

    await this.sendVerificationCodeEmailUseCase.execute({
      token: token as string,
      userEmail: createdUser.email,
      username: `${createdUser.name} ${createdUser.lastname}`,
      verificationCode: verificationCode.code
    })

    res.status(201).json({ 
      ok: true, 
      message: `🚀 Se ha enviado un correo a ${createdUser.email}. Revisa tu bandeja de entrada y valida tu cuenta`,
      user: createdUser 
    })
  }

  public validateUser = async (req: Request, res: Response) => {
    const [ validateUserDto, errorMessage ] = ValidateUserValidator.validate(req.body)
    if ( errorMessage ) throw new ValidationError(errorMessage, 'VALIDATE_USER_VALIDATION_ERROR');
  
    const payload = await JwtAdapter.validateToken<{id: string}>(validateUserDto!.token)
    const userId = payload!.id

    const verificationCode = await this.getVerificationCodeUseCase.execute({ code: validateUserDto!.code })
    
    if ( verificationCode.userId !== userId ) throw new ValidationError("El código no corresponde con el usuario", 'VALIDATE_USER_VALIDATION_ERROR')

    if (DatesAdapter.isExpired(new Date(verificationCode.expiresAt), 10)) {
      throw new ValidationError("El código ha expirado. Solicita uno nuevo.", 'VALIDATE_USER_CODE_EXPIRED');
    }

    const user = await this.validateUserUseCase.execute({ userId })

    res.status(200).json({
      ok: true,
      message: '✅ Usuario validado y activado correctamente',
      user
    })

  }

  public deactivateUser = async (req: Request, res: Response) => {
    const { id } = req.params    
    const user = await this.changeStatusUseCase.execute({ userId: id }, false)

    await this.sendDeactivationAccountEmailUseCase.execute({ userEmail: user.email, username: user.name})

    res.status(200).json({
      ok: true,
      message: 'Se ha desactivado el usuario exitosamente',
      user: user
    })
  }

  public activateUser = async (req: Request, res: Response) => {
    const { id } = req.params    
    const user = await this.changeStatusUseCase.execute({ userId: id }, true)

    res.status(200).json({
      ok: true,
      message: 'Se ha activado el usuario exitosamente',
      user: user
    })
  }

  public getUserById = async( req: Request, res: Response ) => {
    const { id } = req.params

    const user  = await this.getUserUseCase.execute({id})

    res.status(200).json({
      ok: true,
      user
    })
  }
  

}