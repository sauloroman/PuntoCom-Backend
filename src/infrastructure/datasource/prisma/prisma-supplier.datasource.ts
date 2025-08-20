import { PrismaClient, Supplier as PrismaSupplier } from "../../../../generated/prisma";
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { SupplierDatasource } from "../../../domain/datasources/supplier.datasource";
import { Supplier } from "../../../domain/entities";
import { Email, Phone } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";

export class PrismaSupplierDatasource implements SupplierDatasource {
    
    private readonly prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
      this.prisma = prismaClient;
    }

    async findById(supplierId: string): Promise<Supplier | null> {
        try {
            const supplier = await this.prisma.supplier.findUnique({ where: { supplier_id: supplierId }})
            if ( !supplier ) return null
            return this.toDomain(supplier)
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al obtener el proveedor por id',
                'PRISMA_GET_SUPPLIER_BY_ID_ERROR',
                error
            );
        }
    }
    
    async findByEmail(supplierEmail: string): Promise<Supplier | null> {
        try {
            const supplier = await this.prisma.supplier.findUnique({ where: { supplier_email: supplierEmail }})
            if ( !supplier ) return null
            return this.toDomain(supplier)
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al obtener el proveedor por empresa',
                'PRISMA_GET_SUPPLIER_BY_ID_ERROR',
                error
            );
        }
    }
    
    async create(supplier: Supplier): Promise<Supplier> {
        try {
            const supplierCreated = await this.prisma.supplier.create({ data: this.toPrisma(supplier)})
            return this.toDomain( supplierCreated )
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al crear el proveedor',
                'PRISMA_CREATE_SUPPLIER_ERROR',
                error
            );
        }
    }
    
    async update(supplier: Supplier): Promise<Supplier> {
        try {
            throw new Error('')
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al actualizar el proveeodr',
                'PRISMA_UPDATE_SUPPLIER_ERROR',
                error
            );
        }
    }
    
    async changeStatus(supplierId: string, status: boolean): Promise<Supplier> {
        try {
            const updatedSupplier = await this.prisma.supplier.update({ 
                where: { supplier_id: supplierId }, 
                data: { supplier_is_active: status }
            })
            return this.toDomain( updatedSupplier )
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al cambiar el estado del proveedor',
                'PRISMA_CHANGE_SUPPLIER_ERROR',
                error
            );
        }
    }
    
    async getSuppliers(pagination: PaginationDTO): Promise<PaginationResponseDto<Supplier>> {
        throw new Error("Method not implemented.");
    }
    
    async getAllSuppliers(): Promise<Supplier[]> {
        try {
            const suppliers = await this.prisma.supplier.findMany()
            return suppliers.map( this.toDomain )
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al obtener todos los proveedores',
                'PRISMA_GET_ALL_SUPPLIERS_ERROR',
                error
            );
        }
    }

    private toDomain(supplierData: PrismaSupplier): Supplier {
        return new Supplier({
            id: supplierData.supplier_id,
            name: supplierData.supplier_name,
            lastname: supplierData.supplier_lastname,
            company: supplierData.supplier_company,
            email: new Email(supplierData.supplier_email),
            phone: new Phone( supplierData.supplier_phone ),
            address: supplierData.supplier_address,
            isActive: supplierData.supplier_is_active,
            createdAt: supplierData.supplier_createdAt,
            updatedAt: supplierData.supplier_updatedAt
        })
    }

    private toPrisma(supplier: Supplier): Omit<PrismaSupplier, 'supplier_id' | 'supplier_createdAt' | 'supplier_updatedAt'>  {
        return {
            supplier_name: supplier.name,
            supplier_lastname: supplier.lastname,
            supplier_address: supplier.address,
            supplier_company: supplier.company,
            supplier_email: supplier.email.value,
            supplier_phone: supplier.phone.value,
            supplier_is_active: supplier.isActive
        }
    }

}