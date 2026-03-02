import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { FilterSuppliers } from "../../application/dtos/supplier.dto";
import { SupplierDatasource } from "../../domain/datasources/supplier.datasource";
import { Supplier } from "../../domain/entities";
import { SupplierRepository } from "../../domain/repositories/supplier.repository";

export class SupplierRepositoryImpl implements SupplierRepository {

    constructor(private readonly supplierDatasource: SupplierDatasource){}
    
    async getUniqueCompanies(): Promise<string[]> {
        return await this.supplierDatasource.getUniqueCompanies()
    }
    
    async findById(supplierId: string): Promise<Supplier | null> {
        return await this.supplierDatasource.findById(supplierId)
    }

    async findByEmail(supplierEmail: string): Promise<Supplier | null> {
        return await this.supplierDatasource.findByEmail(supplierEmail)
    }

    async create(supplier: Supplier): Promise<Supplier> {
        return await this.supplierDatasource.create( supplier )
    }

    async update(supplier: Supplier): Promise<Supplier> {
        return await this.supplierDatasource.update(supplier)
    }

    async changeStatus(supplierId: string, status: boolean): Promise<Supplier> {
        return await this.supplierDatasource.changeStatus(supplierId, status)
    }

    async filterSuppliers(pagination: PaginationDTO, filter: FilterSuppliers): Promise<PaginationResponseDto<Supplier>> {
        return await this.supplierDatasource.filterSuppliers(pagination, filter)
    }

    async getAllSuppliers(): Promise<Supplier[]> {
        return await this.supplierDatasource.getAllSuppliers()
    }

}