import { Request, Response } from "express";
import { SaleService } from "../../application/services/sale.service";
import { SaveSaleValidator } from "../validators/sale/save-sale.validator";
import { ApplicationError } from "../../application/errors/application.error";

export class SalesController {

    constructor(private readonly saleService: SaleService){}

    public saveSale = async (req: Request, res: Response) => {
        const [ dto, errorMessage ] = SaveSaleValidator.validate( req.body )
        if ( errorMessage ) throw new ApplicationError(errorMessage, 'VALIDATE_SAVE_SALE')
    
        const user = req.body.user

        const saleInfo = {
            total: dto?.total!,
            userId: user.id
        }

        const sale = await this.saleService.saveSale( saleInfo, dto?.details! )

        res.status(200).json({
            ok: true,
            message: 'Venta guardada',
            sale: sale
        })
    }

}