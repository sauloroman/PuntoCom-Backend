import { NextFunction, Request, Response } from "express";
import { StockCriteria } from "../../application/dtos/product.dto";

export class ValidateStockCriteriaMiddleware {

    public static validate() {
        return (req: Request, res: Response, next: NextFunction) => {
            const { criteria } = req.params

            const validCriteria = Object.values(StockCriteria)

            if ( !criteria ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El criterio de stock es requerido',
                    error: 'MISSING_STOCK_CRITERIA'
                })
            }

            if ( !validCriteria.includes(criteria as StockCriteria) ) {
                return res.status(400).json({
                    ok: false,
                    msg: `El criterio de stock ${criteria} no es válido. Los valores permitidos son: ${validCriteria.join(', ')}`,
                    error: 'INVALID_STOCK_CRITERIA',
                    validValues: validCriteria
                })
            }

            next()
        }
    }

}