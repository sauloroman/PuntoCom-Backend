import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../application/errors/validation.error";
import { JwtAdapter } from "../../config/plugins";

export class ParamsHandlerMiddleware {

  public static hasIDItem() {
    return (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError("El parámetro 'id' es obligatorio", "MISSING_ID_PARAM");
      }
      next();
    }
  }

  public static isUserIDSameInToken() {
    return async ( req: Request, res: Response, next: NextFunction ) => {
      const { id } = req.params
      const { token } = req.body

      const payload = await JwtAdapter.validateToken<{id: string}>(token)
      if ( !payload ) throw new ValidationError("El token es inválido", "MISSING_ID_PARAM");

      const userId = payload.id
      if ( id !== userId ) throw new ValidationError("El parámetro 'id' no coincide con el 'id' del token", "MISSING_ID_PARAM");

      next()
    }
  }
}
