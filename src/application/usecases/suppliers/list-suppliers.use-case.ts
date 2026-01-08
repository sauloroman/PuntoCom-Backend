import { DatesAdapter } from "../../../config/plugins";
import { Supplier } from "../../../domain/entities";
import { SupplierRepository } from "../../../domain/repositories";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { SupplierResponseDto } from "../../dtos/supplier.dto";

export class ListSuppliersUseCase {

    constructor(private readonly supplierRepository: SupplierRepository){}

    public async execute( pagination: PaginationDTO ): Promise<PaginationResponseDto<SupplierResponseDto>> {

        const { items, page, total, totalPages } = await this.supplierRepository.getSuppliers(pagination)

        const suppliers  = items.map((supplier: Supplier): SupplierResponseDto => {
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

        return {
            items: suppliers,
            page: page,
            total: total,
            totalPages: totalPages
        }

    }

}