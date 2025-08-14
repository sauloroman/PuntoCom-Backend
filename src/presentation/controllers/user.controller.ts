import { JwtAdapter } from '../../config/plugins/jwt.plugin';
import { CreateUserUseCase, GetUserUseCase, ChangeStatusUserUseCase } from '../../application/usecases/user';
import { ValidationError } from '../../application/errors/validation.error';
import { SendDeactivationAccountEmailUseCase, SendVerificationCodeEmailUseCase } from '../../application/usecases/email';
import { CreateVerificationCodeUseCase } from '../../application/usecases/verification-code';
import { CreateUserValidator } from '../validators/user/create-user.validator';
import { Request, Response } from 'express';

interface UserControllerI {
  createUserUseCase: CreateUserUseCase
  getUserUseCase: GetUserUseCase
  changeStatusUseCase: ChangeStatusUserUseCase
  createVerificationCodeUseCase: CreateVerificationCodeUseCase
  sendDeactivationAccountEmailUseCase: SendDeactivationAccountEmailUseCase
  sendVerificationCodeEmailUseCase: SendVerificationCodeEmailUseCase  
}

export class UserController {

  private readonly createUserUseCase: CreateUserUseCase;
  private readonly getUserUseCase: GetUserUseCase;
  private readonly changeStatusUseCase: ChangeStatusUserUseCase;
  private readonly createVerificationCodeUseCase: CreateVerificationCodeUseCase;
  private readonly sendDeactivationAccountEmailUseCase: SendDeactivationAccountEmailUseCase;
  private readonly sendVerificationCodeEmailUseCase: SendVerificationCodeEmailUseCase;

  constructor({
    changeStatusUseCase,
    createUserUseCase,
    createVerificationCodeUseCase,
    getUserUseCase, 
    sendDeactivationAccountEmailUseCase,
    sendVerificationCodeEmailUseCase
   }: UserControllerI) {
    this.changeStatusUseCase = changeStatusUseCase
    this.createUserUseCase = createUserUseCase
    this.createVerificationCodeUseCase = createVerificationCodeUseCase
    this.getUserUseCase = getUserUseCase
    this.sendDeactivationAccountEmailUseCase = sendDeactivationAccountEmailUseCase
    this.sendVerificationCodeEmailUseCase = sendVerificationCodeEmailUseCase
   }

  public createUser = async ( req: Request, res: Response ) => {
    const [ createUserDto, errorMessage ] = CreateUserValidator.validate(req.body) 
    if ( errorMessage ) throw new ValidationError(errorMessage, 'CREATE_USER_VALIDATION_ERROR');

    const createdUser = await this.createUserUseCase.execute( createUserDto! )
    const verificationCode = await this.createVerificationCodeUseCase.execute({userId: createdUser.id})
    const token = await JwtAdapter.generateJWT({ email: createdUser.email })

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