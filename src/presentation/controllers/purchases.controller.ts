import { Request, Response } from "express";
import { PurchaseService } from "../../application/services";
import { SavePurchaseValidator } from "../validators/purchase";
import { ApplicationError } from "../../application/errors/application.error";
import { FilterPurchase } from "../../application/dtos/purchase.dto";

export class PurchasesController {

    constructor(private readonly purchaseService: PurchaseService ){}

    public getPurchaseById = async (req: Request, res: Response) => {
        const { id: purchaseId } = req.params
        const purchase = await this.purchaseService.getPurchaseById( purchaseId )
        res.status(200).json({
            ok: true,
            purchase
        })
    }

    public filterPurchases = async (req: Request, res: Response) => {
        const { page, limit, minPrice, maxPrice, dateFrom, dateTo, user, supplier } = req.query
        const sort = (req as any).sort

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sort: sort as string
        }

        const filters: FilterPurchase = {}

        if (minPrice || maxPrice) {
            filters.prices = {
                minPrice: minPrice ? Number(minPrice) : 0,
                maxPrice: maxPrice ? Number(maxPrice) : 0
            }
        }
        if (dateFrom && dateTo) {
            filters.dates = {
                dateFrom: new Date(dateFrom as string),
                dateTo: new Date(dateTo as string)
            }
        } 
        if ( user ) {
            filters.user = user as string
        }
        if ( supplier ) {
            filters.supplier = supplier as string
        }

        const {
            items,
            page: currentPage,
            total,
            totalPages
        } = await this.purchaseService.filterPurchases( filters, pagination )

        res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total,
                filters: {
                    prices: filters.prices || null,
                    dates: filters.dates || null,
                    user: filters.user || null,
                    supplier: filters.supplier || null
                }
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