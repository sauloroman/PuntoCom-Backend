import { NextFunction, Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/usecases/user/create-user.use-case';
import { CreateUserValidator } from '../validators/user/create-user.validator';
import { BadRequestError } from '../error';

interface UserControllerOptions {
  createUserUseCase: CreateUserUseCase
}

export class UserController {

  private createUserUseCase: CreateUserUseCase

  constructor({ createUserUseCase }: UserControllerOptions) {
    this.createUserUseCase = createUserUseCase 
  }

  public createUser = async ( req: Request, res: Response ) => {
    try {

      const [ createUserDto, errorMessage ] = CreateUserValidator.validate(req.body) 

      if ( errorMessage ) throw new BadRequestError( errorMessage )

      const result = await this.createUserUseCase.execute( createUserDto! )

      res.status(201).json({ 
        ok: true, 
        message: 'El usuario ha sido creado exitosamente',
        user: result 
      })

    } catch(error) {
      res.status(400).json({ ok: false, message: (error as Error).message });
    }
  }
  

}