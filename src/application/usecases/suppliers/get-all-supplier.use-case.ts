import { DatesAdapter } from "../../../config/plugins";
import { Supplier } from "../../../domain/entities";
import { SupplierRepository } from "../../../domain/repositories/supplier.repository";
import { SupplierResponseDto } from "../../dtos/supplier.dto";

export class GetAllSuppliersUseCase {

    constructor(private readonly supplierRepository: SupplierRepository){}

    public async execute(): Promise<SupplierResponseDto[]> {
        const suppliers = await this.supplierRepository.getAllSuppliers()
        return suppliers.map( (supplier: Supplier) => {
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
        })
    }

}