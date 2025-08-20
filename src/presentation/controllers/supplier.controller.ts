import { Request, Response } from "express";
import { SupplierService } from "../../application/services";
import { CreateSupplierValidator } from "../validators/supplier/create-supplier.validator";
import { ApplicationError } from "../../application/errors/application.error";
import { UpdateSupplierValidator } from "../validators/supplier/update-supplier.validator";

export class SupplierController {

    constructor(private readonly supplierService: SupplierService){}

    public postSupplier = async(req: Request, res: Response) => {
        const [ dto, error ] = CreateSupplierValidator.validate( req.body )
        if ( error ) throw new ApplicationError(error, 'CREATE_SUPPLIER_VALIDATOR_ERROR')
    
        const supplier = await this.supplierService.createSupplier( dto! )

        res.status(201).json({
            ok: true,
            message: `Se ha creado el proveedor correctamente`,
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
            message: 'El proveedor ha sido actualizado correctamente',
            supplier: updatedSupplier
        })

    }

}