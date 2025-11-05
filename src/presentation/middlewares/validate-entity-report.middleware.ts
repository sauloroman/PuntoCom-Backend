import { NextFunction, Request, Response } from "express";

export class ValidateEntityReportMiddleware {

    public static validate() {
        return (req: Request, res: Response, next: NextFunction) => {
            const { entity } = req.params;

            if (!['suppliers', 'users', 'products', 'purchases'].includes(entity)) {
                return res.status(400).json({ message: 'Tipo de reporte no válido' });
            }

            next()
        }
    }

}