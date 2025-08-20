import { DatesAdapter } from "../../../config/plugins";
import { Supplier } from "../../../domain/entities";
import { SupplierRepository } from "../../../domain/repositories/supplier.repository";
import { Email, Phone } from "../../../domain/value-objects";
import { SupplierResponseDto, UpdateSupplierRequestDto } from "../../dtos/supplier.dto";
import { ApplicationError } from "../../errors/application.error";

export class UpdateSupplierUseCase {

    private readonly MESSAGE_ERROR = 'UPDATE_SUPPLIER_ERROR'

    constructor(private readonly supplierRepository: SupplierRepository){}

    public async execute( data: UpdateSupplierRequestDto ): Promise<SupplierResponseDto> {
        
        if ( data.email ) {
            const existingSupplier = await this.supplierRepository.findByEmail( data.email )
            if ( existingSupplier ) throw new ApplicationError(`El proveedor con email: ${data.email} ya existe. Intente con otro`, this.MESSAGE_ERROR)
        }

        const supplierToUpdate = await this.supplierRepository.findById(data.id)
        if (!supplierToUpdate) throw new ApplicationError(`El proveedor con id ${data.id} no existe`, this.MESSAGE_ERROR)
        
        const supplier = new Supplier({
            id: supplierToUpdate.id,
            name: data.name ? data.name : supplierToUpdate.name,
            lastname: data.lastname ? data.lastname : supplierToUpdate.lastname,
            company: data.company ? data.company : supplierToUpdate.company,
            email: data.email ? new Email(data.email) : supplierToUpdate.email,
            phone: data.phone ? new Phone(data.phone): supplierToUpdate.phone,
            address: data.address ? data.address: supplierToUpdate.address,
            isActive: supplierToUpdate.isActive,
            createdAt: DatesAdapter.toLocal( supplierToUpdate.createdAt ),
            updatedAt: DatesAdapter.toLocal( DatesAdapter.now() )
        })

        const supplierUpdated = await this.supplierRepository.update( supplier )

        return {
            id: supplierUpdated.id,
            name:supplierUpdated.name,
            lastname: supplierUpdated.lastname,
            company: supplierUpdated.company,
            email: supplierUpdated.email.value,
            phone: supplierUpdated.phone.value,
            address: supplierUpdated.address,
            isActive: supplierUpdated.isActive,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(supplierUpdated.createdAt)),
            updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(supplierUpdated.updatedAt)),
        }

    }

}