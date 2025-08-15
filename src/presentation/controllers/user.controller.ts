// src/presentation/controllers/UserController.ts
import { Request, Response } from 'express';
import { ChangePasswordValidator, CreateUserValidator, LoginUserValidator, UpdateUserValidator, ValidateUserValidator } from '../validators/user';
import { ValidationError } from '../../application/errors/validation.error';
import { UserService } from '../../application/services/user.service';
import { ForgotPasswordUserValidator } from '../validators/user/forgot-password-user.validator';

export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  public createUser = async (req: Request, res: Response) => {
    const [dto, error] = CreateUserValidator.validate(req.body)
    if (error) throw new ValidationError(error, 'CREATE_USER_VALIDATION_ERROR')

    const result = await this.userService.registerUser(dto!)
    
    res.status(201).json({
      ok: true,
      message: `🚀 Se ha enviado un correo a ${result.user.email}. Revisa tu bandeja de entrada y valida tu cuenta`,
      user: result.user
    })
  }

  public updateUser = async (req: Request, res: Response) => {

    const { id } = req.params

    const [dto, error] = UpdateUserValidator.validate(req.body)
    if (error) throw new ValidationError(error, 'UPDATE_USER_VALIDATION_ERROR')
    
    const updatedUser = await this.userService.updateUser({ ...dto, id })

    res.status(200).json({
      ok: true,
      message: `✅ Usuario se ha actualizado correctamente`,
      user: updatedUser
    })

  }

  public validateUser = async (req: Request, res: Response) => {
    const [dto, error] = ValidateUserValidator.validate(req.body)
    if (error) throw new ValidationError(error, 'VALIDATE_USER_VALIDATION_ERROR')

    const user = await this.userService.validateUser(dto!.token, dto!.code)

    res.status(200).json({
      ok: true,
      message: '✅ Usuario validado y activado correctamente',
      user
    })
  }

  public login = async (req: Request, res: Response) => {
    const [dto, error] = LoginUserValidator.validate(req.body)
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

  public forgotPassword = async(req: Request, res: Response) => {
    const [ dto, error ] = ForgotPasswordUserValidator.validate( req.body )
    if (error) throw new ValidationError(error, 'FORGOT_PASSWORD__USER_VALIDATION_ERROR')
    await this.userService.forgotPassword( dto! )
    res.status(200).json({
      ok: true,
      message: `Se ha enviado un correo electrónico a ${dto?.email}. Revisa tu bandeja y sigue las instrucciones.`
    })

  }

  public changePassword = async (req: Request, res: Response) => {
    const [ dto, error ] = ChangePasswordValidator.validate( req.body )
    if (error) throw new ValidationError(error, 'CHANGE_PASSWORD__USER_VALIDATION_ERROR')
    
    await this.userService.changePassword(dto!)

    res.status(200).json({
      ok: true,
      message: 'Se ha actualizado la contraseña correctamente'
    })

  }

  public getUserById = async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id)
    res.status(200).json({ ok: true, user })
  }
}
