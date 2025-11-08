import { NextFunction, Request, Response } from "express";

export class ValidateFiltersMiddleware {

    public static validateSaleFilters() {
        return ( req: Request, res: Response, next: NextFunction ) => {
            const { priceMin, priceMax, dateFrom, dateTo } = req.query

            if ( priceMin || priceMax ) {
                if ( !priceMin || !priceMax ) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Debes proporcionar tanto priceMin como priceMax'
                    })
                }

                const min = Number(priceMin)
                const max = Number(priceMax)

                if (isNaN(min) || isNaN(max)) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Los precios deben ser números válidos'
                    })
                }

                if (min < 0 || max < 0) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Los precios no pueden ser negativos'
                    })
                }

                if (max < min) {
                    return res.status(400).json({
                        ok: false,
                        message: 'El precio máximo debe ser mayor o igual al mínimo'
                    })
                }
            }

            if ( dateFrom || dateTo ) {
                if ( !dateFrom || !dateTo ) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Debes proporcionar tanto dateFrom como dateTo'
                    })
                }

                const from = new Date(dateFrom as string)
                const to = new Date(dateTo as string)

                if (isNaN(from.getTime()) || isNaN(to.getTime())) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Las fechas deben tener un formato válido (ISO 8601)'
                    })
                }

                if (to < from) {
                    return res.status(400).json({
                        ok: false,
                        message: 'La fecha final debe ser mayor o igual a la inicial'
                    })
                }

            }

            next()
        }
    }

}