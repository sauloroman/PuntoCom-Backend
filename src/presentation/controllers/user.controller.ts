import { Request, Response } from 'express';
import { CreateUserValidator } from '../validators/user/create-user.validator';
import { CreateUserUseCase, GetUserUseCase } from '../../application/usecases/user';
import { ValidationError } from '../../application/errors/validation.error';
import { SendVerificationCodeEmailUseCase } from '../../application/usecases/email';
import { CreateVerificationCodeUseCase } from '../../application/usecases/verification-code';
import { JwtAdapter } from '../../config/plugins/jwt.plugin';

export class UserController {

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createVerificationCodeUseCase: CreateVerificationCodeUseCase,
    private readonly sendVerificationCodeEmail: SendVerificationCodeEmailUseCase
  ) {}

  public createUser = async ( req: Request, res: Response ) => {
    const [ createUserDto, errorMessage ] = CreateUserValidator.validate(req.body) 
    if ( errorMessage ) throw new ValidationError(errorMessage, 'CREATE_USER_VALIDATION_ERROR');

    const createdUser = await this.createUserUseCase.execute( createUserDto! )
    const verificationCode = await this.createVerificationCodeUseCase.execute({userId: createdUser.id})
    const token = await JwtAdapter.generateJWT({ email: createdUser.email })

    await this.sendVerificationCodeEmail.execute({
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

  public getUserById = async( req: Request, res: Response ) => {
    const { id } = req.params

    const user  = await this.getUserUseCase.execute({id})

    res.status(200).json({
      ok: true,
      user
    })
  }
  

}