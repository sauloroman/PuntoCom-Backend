import { Request, Response } from "express";
import { SupplierService } from "../../application/services";
import { CreateSupplierValidator } from "../validators/supplier/create-supplier.validator";
import { ApplicationError } from "../../application/errors/application.error";
import { UpdateSupplierValidator } from "../validators/supplier/update-supplier.validator";

export class SupplierController {

    constructor(private readonly supplierService: SupplierService){}

    public getSuppliers = async (req: Request, res: Response) => {
        const { page, limit } = req.query
        const sort = (req as any).sort
        const filter = (req as any).filter

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sort: sort as string,
            filter: filter as string,
        }
        
        const { items, page: currentPage, total, totalPages }  = await this.supplierService.listSuppliers( pagination )
        
        return res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total,
            },
            suppliers: items,
        })
    }

    public postSupplier = async(req: Request, res: Response) => {
        const [ dto, error ] = CreateSupplierValidator.validate( req.body )
        if ( error ) throw new ApplicationError(error, 'CREATE_SUPPLIER_VALIDATOR_ERROR')
    
        const supplier = await this.supplierService.createSupplier( dto! )

        res.status(201).json({
            ok: true,
            message: `Se ha creado el proveedor exitosamente`,
            supplier: supplier
        })
    }

    public updateSupplier = async(req: Request, res: Response) => {
        const { id: supplierId } = req.params
        const [ dto, error ] = UpdateSupplierValidator.validate( req.body )
        if ( error ) throw new ApplicationError(error, 'UPDATE_SUPPLIER_VALIDATOR_ERROR')
            
        const updatedSupplier = await this.supplierService.updateSupplier({ id: supplierId, ...dto })

        res.status(200).json({
            ok: true,
            message: 'El proveedor ha sido actualizado exitosamente',
            supplier: updatedSupplier
        })
    }

    public deactivateSupplier = async (req: Request, res: Response) => {
        const { id: supplierId } = req.params
        const supplier = await this.supplierService.deactivateSupplier(supplierId)
        res.status(200).json({
            ok: true,
            message: 'El proveedor ha sido desactivado exitosamente',
            supplier: supplier
        })
    }

    public activateSupplier = async (req: Request, res: Response) => {
        const { id: supplierId } = req.params
        const supplier = await this.supplierService.activateSupplier(supplierId)
        res.status(200).json({
            ok: true,
            message: 'El proveedor ha sido activado exitosamente',
            supplier: supplier
        })
    }

    public getSupplierById = async (req: Request, res: Response) => {
        const { id: supplierId } = req.params
        const supplier = await this.supplierService.getSupplierById(supplierId)
        res.status(200).json({
            ok: true,
            supplier
        })
    }

    public generateListSuppliersReport = async ( req: Request, res: Response ) => {
        const pdfUrl = await this.supplierService.generateListSupplierReport()
        res.status(200).json({
            ok: true,
            message: 'Reporte de proveedores generado exitosamente',
            url: pdfUrl
        })
    }

}