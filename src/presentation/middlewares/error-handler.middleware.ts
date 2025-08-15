import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../domain/errors/domain.error';
import { ApplicationError } from '../../application/errors/application.error';
import { InfrastructureError } from '../../infrastructure/errors/infrastructure-error';
import { ValidationError } from '../../application/errors/validation.error';

export class ErrorHandlerMiddleware {

  public static getHandler() {
    return (err: unknown, req: Request, res: Response, next: NextFunction) => {
      console.error(err); 

      if (err instanceof DomainError) {
        return res.status(400).json({
          ok: false,
          layer: 'DOMAIN',
          code: err.code ?? 'DOMAIN_ERROR',
          message: err.message,
        });
      }

      if (err instanceof ApplicationError) {
        switch (err.code) {
          case 'USER_NOT_FOUND':
            return res.status(404).json({ ok: false, layer: 'APPLICATION', code: err.code, message: err.message });
          case 'LOGIN_USER_ERROR':
            return res.status(401).json({ ok: false, layer: 'APPLICATION', code: err.code, message: err.message });
          case 'CREATE_USER_ERROR':
            return res.status(400).json({ ok: false, layer: 'APPLICATION', code: err.code, message: err.message });
          case 'MISSING_ID_PARAM':
            return res.status(403).json({ ok: false, layer: 'APPLICATION', code: err.code, message: err.message });
          default:
            return res.status(400).json({ ok: false, layer: 'APPLICATION', code: err.code, message: err.message });
        }
      }

      if (err instanceof InfrastructureError) {
        return res.status(500).json({
          ok: false,
          layer: 'INFRASTRUCTURE',
          code: err.code ?? 'INFRASTRUCTURE_ERROR',
          message: err.message,
        });
      }

      if (err instanceof ValidationError) {
        return res.status(400).json({
          ok: false,
          layer: 'APPLICATION',
          code: err.code,
          message: err.message
        });
      }      

      return res.status(500).json({
        ok: false,
        layer: 'UNKNOWN',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocurrió un error inesperado',
      });
    };
  }
}
