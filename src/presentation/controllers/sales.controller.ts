import { Request, Response } from "express";
import { SaleService } from "../../application/services/sale.service";
import { SaveSaleValidator } from "../validators/sale/save-sale.validator";
import { ApplicationError } from "../../application/errors/application.error";
import { SaleFilters } from "../../application/dtos/sale.dto";

export class SalesController {

    constructor(private readonly saleService: SaleService){}

    private formatFilters( req: Request ): SaleFilters {
        const { minPrice, maxPrice, dateFrom, dateTo, user } = req.query
        const filters: SaleFilters = {}

        if ( minPrice && maxPrice ) {
            filters.prices = {
                minPrice: Number(minPrice),
                maxPrice: Number(maxPrice)
            }
        }

        if ( dateFrom && dateTo ) {
            filters.dates = {
                dateFrom: new Date(dateFrom as string),
                dateTo: new Date(dateTo as string)
            }
        }

        if ( user ) {
            filters.user = user as string
        }

        return filters
    }

    public listSales = async (req: Request, res: Response) => {
        const { page, limit } = req.query
        const sort = (req as any).sort

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sort: sort as string,
        }

        const { 
            items,
            page: currentPage,
            total,
            totalPages
        } = await this.saleService.listSales( pagination )

        res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total
            },
            sales: items
        })
    }

    public getSaleById = async (req: Request, res: Response) => {
        const { id: saleId } = req.params
        const sale = await this.saleService.getSaleById( saleId )
        res.status(200).json({
            ok: true,
            sale
        })
    }

    public filterSales = async (req: Request, res: Response) => {
        const { page, limit } = req.query
        const sort = (req as any).sort

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sort: sort as string
        }

        const filters = this.formatFilters(req)

        const {
            items,
            page: currentPage,
            total,
            totalPages
        } = await this.saleService.filterSales(filters, pagination)

        res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total,
                filters: {
                    prices: filters.prices || null,
                    dates: filters.dates || null,
                    user: filters.user || null
                }
            },
            sales: items
        })
    }

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