import { Request, Response } from "express";
import { InventoryAdjustmentService } from "../../application/services";
import { SaveInventoryAdjustmentValidator } from "../validators/inventory-adjustment";
import { ApplicationError } from "../../application/errors/application.error";
import { PaginationDTO } from "../../application/dtos/pagination.dto";

export class InventoryAdjustmentController {
    
    constructor(private readonly inventoryAdjustmentService: InventoryAdjustmentService ){}

    public postInventoryAdjustment = async ( req: Request, res: Response ) => {
        const { id: userId } = req.body.user

        const [ dto, errorMessage ] = SaveInventoryAdjustmentValidator.validate( req.body )
        if ( errorMessage ) throw new ApplicationError(errorMessage, 'SAVE_INVENTORY_ADJUSTMENT_ERROR')

        const adjustmentSaved = await this.inventoryAdjustmentService.saveInventoryAdjustment(dto!, userId)

        res.status(201).json({
            ok: true,
            message: 'Ajuste guardado',
            adjustmentSaved
        })
    }

    public getInventoryAdjustments = async (req: Request, res: Response) => {
        const { page, limit } = req.query
        const sort = (req as any).sort
        const filter = (req as any).filter
        
        const pagination: PaginationDTO = {
            page: Number(page),
            limit: Number(limit),
            sort: sort,
            filter: filter
        }

        const { 
            items, 
            page: currentPage, 
            total, 
            totalPages 
        } = await this.inventoryAdjustmentService.listAdjustments(pagination)

        res.status(200).json({
            ok: true, 
            meta: {
                page: currentPage,
                totalPages,
                total
            },
            adjustments: items
        })

    }

}