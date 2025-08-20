import { DatesAdapter } from "../../../config/plugins";
import { SupplierRepository } from "../../../domain/repositories/supplier.repository";
import { SupplierResponseDto } from "../../dtos/supplier.dto";
import { ApplicationError } from "../../errors/application.error";

export class ChangeStatusSupplierUseCase {
        
    private readonly MESSAGE_ERROR = 'SUPPLIER_NOT_EXISTS_ERROR'

    constructor(private readonly supplierRepository: SupplierRepository){}

    public async execute( supplierId: string, status: boolean ): Promise<SupplierResponseDto> {

        const existingSupplier = await this.supplierRepository.findById( supplierId )
        if ( !existingSupplier ) throw new ApplicationError(`El proveedor con id: ${supplierId} no existe`, this.MESSAGE_ERROR)

        const supplierUpdated = await this.supplierRepository.changeStatus(supplierId, status)

        return {
            id: supplierUpdated.id,
            name: supplierUpdated.name,
            lastname: supplierUpdated.lastname,
            address: supplierUpdated.address,
            company: supplierUpdated.company,
            email: supplierUpdated.email.value,
            phone: supplierUpdated.phone.value,
            isActive: supplierUpdated.isActive,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(existingSupplier.createdAt) ),
            updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(existingSupplier.updatedAt) )
        }
    }

}