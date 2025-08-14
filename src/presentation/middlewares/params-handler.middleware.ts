import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../application/errors/validation.error";

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

}
