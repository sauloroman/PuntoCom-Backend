import { Request, Response } from "express";
import { SaleService } from "../../application/services/sale.service";
import { SaveSaleValidator } from "../validators/sale/save-sale.validator";
import { ApplicationError } from "../../application/errors/application.error";
import { SaleFilters } from "../../application/dtos/sale.dto";

export class SalesController {

    constructor(private readonly saleService: SaleService){}

    public getSales = async (req: Request, res: Response) => {
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

    public getFilteredSales = async (req: Request, res: Response) => {
        const { page, limit, priceMin, priceMax, dateFrom, dateTo } = req.query
        const sort = (req as any).sort

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sort: sort as string
        }

        const filters: SaleFilters = {}

        if ( priceMin && priceMax ) {
            filters.prices = {
                priceMin: Number(priceMin),
                priceMax: Number(priceMax),
            }
        }

        if ( dateFrom && dateTo ) {
            filters.dates = {
                dateFrom: new Date(dateFrom as string),
                dateTo: new Date(dateTo as string)
            }
        }

        const {
            items,
            page: currentPage,
            total,
            totalPages
        } = await this.saleService.getFilteredSales(filters, pagination)

        res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total,
                filters: {
                    prices: filters.prices || null,
                    dates: filters.dates || null
                }
            },
            sales: items
        })
    }

    public getFilteredSalesByUser = async (req: Request, res: Response) => {
        const { id: userId } = req.params
        const { page, limit, priceMin, priceMax, dateFrom, dateTo } = req.query
        const sort = (req as any).sort

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sort: sort as string
        }

        const filters: SaleFilters = {}

        if ( priceMin && priceMax ) {
            filters.prices = {
                priceMin: Number(priceMin),
                priceMax: Number(priceMax),
            }
        }

        if ( dateFrom && dateTo ) {
            filters.dates = {
                dateFrom: new Date(dateFrom as string),
                dateTo: new Date(dateTo as string)
            }
        }

        const {
            items,
            page: currentPage,
            total,
            totalPages
        } = await this.saleService.getFilteredSalesByUser(userId, filters, pagination)

        res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total,
                filters: {
                    prices: filters.prices || null,
                    dates: filters.dates || null
                }
            },
            sales: items
        })
    }

    public getSalesByUser = async (req: Request, res: Response) => {
        const { id: userId } = req.params
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
        } = await this.saleService.getSalesByUser( userId, pagination )

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