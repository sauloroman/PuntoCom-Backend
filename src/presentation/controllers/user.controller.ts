import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/usecases/user/create-user.use-case';

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

      const data = req.body
      const result = await this.createUserUseCase.execute( data )
      res.status(201).json(result)

    } catch(error) {
      res.status(400).json({ ok: false, message: (error as Error).message })
    }
  }
  

}