import { DatesAdapter } from "../../../config/plugins";
import { Supplier } from "../../../domain/entities";
import { SupplierRepository } from "../../../domain/repositories/supplier.repository";
import { Email, Phone } from "../../../domain/value-objects";
import { CreateSupplierRequestDto, SupplierResponseDto } from "../../dtos/supplier.dto";
import { ApplicationError } from "../../errors/application.error";

export class CreateSupplierUseCase {

    private readonly MESSAGE_ERROR = 'SUPPLIER_EMAIL_ALREADY_EXISTS_ERROR'

    constructor(private readonly supplierRepository: SupplierRepository){}

    public async execute( data: CreateSupplierRequestDto ): Promise<SupplierResponseDto> {

        const existingSupplier = await this.supplierRepository.findByEmail( data.email )
        if ( existingSupplier ) {
            throw new ApplicationError(
                `El proveedor con correo ${data.email} ya existe. Intente con otro correo`, 
                this.MESSAGE_ERROR
            )
        }
        
        const supplier = new Supplier({
            name: data.name,
            lastname: data.lastname,
            email: new Email(data.email),
            company: data.company,
            phone: new Phone( data.phone ),
            address: undefined,
            isActive: true,
            createdAt: DatesAdapter.now(),
            updatedAt: DatesAdapter.now()
        })

        const supplierCreated = await this.supplierRepository.create(supplier)

        return {
            id: supplierCreated.id,
            name: supplierCreated.name,
            lastname: supplierCreated.lastname,
            email: supplierCreated.email.value,
            company: supplierCreated.company,
            phone: supplierCreated.phone.value,
            address: supplierCreated.address,
            isActive: supplierCreated.isActive,
            createdAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(supplierCreated.createdAt)),
            updatedAt: DatesAdapter.formatLocal( DatesAdapter.toLocal(supplierCreated.updatedAt) ),
        }

    }

}