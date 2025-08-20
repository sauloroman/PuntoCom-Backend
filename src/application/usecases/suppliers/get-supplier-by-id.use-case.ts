import { DatesAdapter } from "../../../config/plugins";
import { SupplierRepository } from "../../../domain/repositories/supplier.repository";
import { SupplierResponseDto } from "../../dtos/supplier.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetSupplierByIdUseCase {
    
    private readonly MESSAGE_ERROR = 'UPDATE_SUPPLIER_ERROR'

    constructor(private readonly supplierRepository: SupplierRepository){}

    public async execute( supplierId: string ): Promise<SupplierResponseDto> {

        const supplier = await this.supplierRepository.findById( supplierId )
        if ( !supplier ) throw new ApplicationError(`El proveedor con id ${supplierId} no existe`, this.MESSAGE_ERROR)

        return {
            id: supplier.id,
            name: supplier.name,
            lastname: supplier.lastname, 
            address: supplier.address,
            email: supplier.email.value,
            phone: supplier.phone.value,
            company: supplier.company,
            isActive: supplier.isActive,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal( supplier.createdAt ) ),
            updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal( supplier.updatedAt ) ),
        }

    }

}