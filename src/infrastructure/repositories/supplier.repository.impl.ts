import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { SupplierDatasource } from "../../domain/datasources/supplier.datasource";
import { Supplier } from "../../domain/entities";
import { SupplierRepository } from "../../domain/repositories/supplier.repository";

export class SupplierRepositoryImpl implements SupplierRepository {

    constructor(private readonly supplierDatasource: SupplierDatasource){}
    
    async findById(supplierId: string): Promise<Supplier | null> {
        throw new Error("Method not implemented.");
    }

    async findByEmail(supplierEmail: string): Promise<Supplier | null> {
        return await this.supplierDatasource.findByEmail(supplierEmail)
    }

    async create(supplier: Supplier): Promise<Supplier> {
        return await this.supplierDatasource.create( supplier )
    }

    async update(supplier: Supplier): Promise<Supplier> {
        throw new Error("Method not implemented.");
    }

    async changeStatus(SupplierId: string, status: boolean): Promise<Supplier> {
        throw new Error("Method not implemented.");
    }

    async getSuppliers(pagination: PaginationDTO): Promise<PaginationResponseDto<Supplier>> {
        throw new Error("Method not implemented.");
    }

    async getAllSuppliers(): Promise<Supplier[]> {
        throw new Error("Method not implemented.");
    }

}