// src/presentation/controllers/UserController.ts
import { Request, Response } from 'express';
import { CreateUserValidator, LoginUserValidator, ValidateUserValidator } from '../validators/user';
import { ValidationError } from '../../application/errors/validation.error';
import { UserService } from '../../application/services/user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public createUser = async (req: Request, res: Response) => {
    const [ dto, error ] = CreateUserValidator.validate(req.body)
    if (error) throw new ValidationError(error, 'CREATE_USER_VALIDATION_ERROR')

    const result = await this.userService.registerUser(dto)
    res.status(201).json({
      ok: true,
      message: `🚀 Se ha enviado un correo a ${result.user.email}. Revisa tu bandeja de entrada y valida tu cuenta`,
      user: result.user
    })
  }

  public validateUser = async (req: Request, res: Response) => {
    const [ dto, error ] = ValidateUserValidator.validate(req.body)
    if (error) throw new ValidationError(error, 'VALIDATE_USER_VALIDATION_ERROR')

    const user = await this.userService.validateUser(dto!.token, dto!.code)
    res.status(200).json({
      ok: true,
      message: '✅ Usuario validado y activado correctamente',
      user
    })
  }

  public login = async (req: Request, res: Response) => {
    const [ dto, error ] = LoginUserValidator.validate(req.body)
    if (error) throw new ValidationError(error, 'LOGIN_USER_VALIDATION_ERROR')

    const result = await this.userService.loginUser(dto!.email, dto!.password)
    res.status(200).json({
      ok: true,
      message: `👋 Bienvenido de vuelta ${result.user.name} ${result.user.lastname}`,
      user: result.user,
      token: result.token
    })
  }

  public deactivateUser = async (req: Request, res: Response) => {
    const user = await this.userService.deactivateUser(req.params.id)
    res.status(200).json({
      ok: true,
      message: 'Se ha desactivado el usuario exitosamente',
      user
    })
  }

  public activateUser = async (req: Request, res: Response) => {
    const user = await this.userService.activateUser(req.params.id)
    res.status(200).json({
      ok: true,
      message: 'Se ha activado el usuario exitosamente',
      user
    })
  }

  public getUserById = async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id)
    res.status(200).json({ ok: true, user })
  }
}
