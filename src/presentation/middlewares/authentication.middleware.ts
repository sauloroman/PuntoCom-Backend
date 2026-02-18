import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/plugins";
import { RoleEnum } from "../../../generated/prisma";
import { UserRepository } from "../../domain/repositories";

export class AuthMiddleware {

  public static isValidJWBody<T>() {
    return async ( req: Request, res: Response, next: NextFunction ): Promise<any> => {
      const payload = await JwtAdapter.validateToken<T>( req.body.token )
      if ( !payload ) return res.status(401).json({ ok: false, error: 'El token es invalido'})
      next()
    }
  }

  public static validateLoggedUser ( userRepository: UserRepository ) {
      return async( req: Request, res: Response, next: NextFunction ): Promise<any> => {
        
        if ( req.method === 'GET' || req.method === 'PATCH' || req.method === 'DELETE') {
          req.body = {}
        }
        
        const authorization = req.header('Authorization')
        if ( !authorization ) return res.status(401).json({ ok: false, error: 'Inicia sesión primero' })
        if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ ok: false, error: 'No hay token'})
      
        const token = authorization.split(' ').at(1) || ''
        try {
          const payload = await JwtAdapter.validateToken<{ id: string, email: string, role: RoleEnum }>( token )
          if ( !payload ) return res.status(401).json({ ok: false, error: 'El token es invalido'})
          
          const user = await userRepository.findById( payload.id )
          
          if ( !user ) return res.status(401).json({ ok: false, error: 'Token Invalido - Usuario no existente'})
    
          req.body.user = user
          next()

        } catch (error) {
          console.log(`${error}`)
          res.status(500).json({ ok: false, error: 'Internal Server Error'})
        }
      }
  }
}