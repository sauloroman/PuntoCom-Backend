import { Request, Response } from "express";
import { PurchaseService } from "../../application/services";
import { SavePurchaseValidator } from "../validators/purchase";
import { ApplicationError } from "../../application/errors/application.error";

export class PurchasesController {

    constructor(private readonly purchaseService: PurchaseService ){}

    public getPurchase = async (req: Request, res: Response ) => {
        const { page, limit } = req.query
        const sort = (req as any).sort
        
        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sort: sort as string 
        }
        
        const {
            items,
            page: currentPage,
            total,
            totalPages
        } = await this.purchaseService.listSales(pagination)

        res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total
            },
            purchases: items
        })

    }

    public savePurchase = async (req: Request, res: Response) => {
        const [ dto, errorMessage ] = SavePurchaseValidator.validate(req.body)
        if ( errorMessage ) throw new ApplicationError(errorMessage, 'VALIDATE_SAVE_PURCHASE')

        const user = req.body.user

        const purchaseInfo = {
            total: dto?.total ?? 0,
            supplierId: dto?.supplierId ?? '',
            userId: user.id
        }

        const purchase = await this.purchaseService.savePurchase(purchaseInfo, dto?.details! )
        
        res.status(200).json({
            ok: true,
            message: 'Compra registrada',
            purchase
        })
    }    

}