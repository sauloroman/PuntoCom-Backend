import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { FilterSuppliers } from "../../application/dtos/supplier.dto";
import { Supplier } from "../entities";

export abstract class SupplierRepository {
    abstract findById( supplierId: string ): Promise<Supplier | null>
    abstract findByEmail( supplierEmail: string ): Promise<Supplier | null>
    abstract create( supplier: Supplier ): Promise<Supplier>
    abstract update( supplier: Supplier ): Promise<Supplier>
    abstract changeStatus( supplierId: string, status: boolean ): Promise<Supplier>
    abstract filterSuppliers( pagination: PaginationDTO, filter: FilterSuppliers ): Promise<PaginationResponseDto<Supplier>>
    abstract getAllSuppliers(): Promise<Supplier[]>
    abstract getUniqueCompanies(): Promise<string[]>
}