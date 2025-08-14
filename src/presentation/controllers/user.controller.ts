import { Request, Response } from 'express';
import { CreateUserValidator } from '../validators/user/create-user.validator';
import { CreateUserUseCase, GetUserUseCase } from '../../application/usecases/user';
import { ValidationError } from '../../application/errors/validation.error';

export class UserController {

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase
  ) {}

  public createUser = async ( req: Request, res: Response ) => {
    const [ createUserDto, errorMessage ] = CreateUserValidator.validate(req.body) 
    if ( errorMessage ) throw new ValidationError(errorMessage, 'CREATE_USER_VALIDATION_ERROR');

    const createdUser = await this.createUserUseCase.execute( createUserDto! )

    res.status(201).json({ 
      ok: true, 
      message: '🚀 El usuario ha sido creado exitosamente',
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