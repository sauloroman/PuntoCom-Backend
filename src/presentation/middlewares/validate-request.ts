import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export class ValidateRequestMiddleware {
  public handle = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = errors.array().map(err => err.msg).join(', ');
      return res.status(400).json({ ok: false, errors: extractedErrors });
    }
    next();
  };
}
