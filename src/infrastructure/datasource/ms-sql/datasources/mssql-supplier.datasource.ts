import { ConnectionPool } from "mssql";
import { PaginationDTO, PaginationResponseDto } from "../../../../application/dtos/pagination.dto";
import { SupplierDatasource } from "../../../../domain/datasources";
import { Supplier } from "../../../../domain/entities";
import { InfrastructureError } from "../../../errors/infrastructure-error";
import { SupplierMapper } from "../mappers/supplier.mapper";
import { FilterSuppliers } from "../../../../application/dtos/supplier.dto";
import { buildMssqlPaginationOptions, buildSupplierFilter } from "../utils";

export class MSSQLSuppliers implements SupplierDatasource {

    constructor(private readonly pool: ConnectionPool){}

    async findById(supplierId: string): Promise<Supplier | null> {
        try {
            const result = await this.pool.request()
                .input('supplier_id', supplierId)
                .query(`
                    SELECT *
                    FROM Supplier
                    WHERE supplier_id = @supplier_id
                `)
                
            if ( !result.recordset[0] ) return null
            return SupplierMapper.fromSQL( result.recordset[0] )

        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener el proveedor por id',
                'MSSQL_FIND_SUPPLIER_BY_ID_ERROR',
                error
            )
        }
    }

    async findByEmail(supplierEmail: string): Promise<Supplier | null> {
        try {
            const result = await this.pool.request()
                .input('supplier_email', supplierEmail)
                .query(`
                    SELECT * 
                    FROM Supplier
                    WHERE supplier_email = @supplier_email    
                `)

            if ( !result.recordset[0] ) return null
            return SupplierMapper.fromSQL( result.recordset[0] )
        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener el proveedor por correo',
                'MSSQL_FIND_SUPPLIER_BY_EMAIL_ERROR',
                error
            )
        }
    }

    async create(supplier: Supplier): Promise<Supplier> {
        try {
            const result = await this.pool.request()
                .input('supplier_id', supplier.id )
                .input('supplier_name', supplier.name )
                .input('supplier_lastname', supplier.lastname )
                .input('supplier_company', supplier.company )
                .input('supplier_phone', supplier.phone.value )
                .input('supplier_email', supplier.email.value )
                .input('supplier_address', supplier.address )
                .input('supplier_is_active', supplier.isActive )
                .input('supplier_createdAt', supplier.createdAt )
                .input('supplier_updatedAt', supplier.updatedAt )
                .query(`
                    INSERT INTO Supplier (
                        supplier_id,
                        supplier_name,
                        supplier_lastname,
                        supplier_company,
                        supplier_phone,
                        supplier_email,
                        supplier_address,
                        supplier_is_active,
                        supplier_createdAt,
                        supplier_updatedAt
                    ) 
                    OUTPUT INSERTED.*
                    VALUES (
                        @supplier_id,
                        @supplier_name,
                        @supplier_lastname,
                        @supplier_company,
                        @supplier_phone,
                        @supplier_email,
                        @supplier_address,
                        @supplier_is_active,
                        @supplier_createdAt,
                        @supplier_updatedAt
                    )
                `)

            return SupplierMapper.fromSQL( result.recordset[0] )
        } catch( error ) {
            throw new InfrastructureError(
                'Error al crear proveedor',
                'MSSQL_CREATE_SUPPLIER_ERROR',
                error
            )
        }
    }
    
    async update(supplier: Supplier): Promise<Supplier> {
        try {
            const result = await this.pool.request()
                .input('supplier_id', supplier.id )
                .input('supplier_name', supplier.name )
                .input('supplier_lastname', supplier.lastname )
                .input('supplier_company', supplier.company )
                .input('supplier_email', supplier.email.value )
                .input('supplier_phone', supplier.phone.value )
                .input('supplier_address', supplier.address )
                .input('supplier_updatedAt', supplier.updatedAt )
                .query(`
                    UPDATE Supplier
                    SET
                        supplier_name = @supplier_name,
                        supplier_lastname = @supplier_lastname,
                        supplier_company = @supplier_company,
                        supplier_email = @supplier_email,
                        supplier_phone = @supplier_phone,
                        supplier_address = @supplier_address,
                        supplier_updatedAt = @supplier_updatedAt
                    OUTPUT INSERTED.*
                    WHERE supplier_id = @supplier_id
                `)                

            return SupplierMapper.fromSQL( result.recordset[0] )
        } catch(error) {
            throw new InfrastructureError(
                'Error al actualizar proveedor',
                'MSSQL_UPDATE_SUPPLIER_ERROR',
                error
            )
        }
    }
    
    async changeStatus(supplierId: string, status: boolean): Promise<Supplier> {
        try {
            const result = await this.pool.request()
                .input('supplier_id', supplierId )
                .input('status', status)
                .query(`
                    UPDATE Supplier
                    SET supplier_is_active = @status
                    OUTPUT INSERTED.*
                    WHERE supplier_id = @supplier_id    
                `)

            return SupplierMapper.fromSQL(result.recordset[0])
        } catch(error) {
            throw new InfrastructureError(
                'Error al cambiar el estado del proveedor',
                'MSSQL_CHANGE_SUPPLIER_STATUS_ERROR',
                error
            )
        }
    }

    async filterSuppliers(pagination: PaginationDTO, filter: FilterSuppliers ): Promise<PaginationResponseDto<Supplier>> {
        try {

            const { page, limit, offset } = buildMssqlPaginationOptions(pagination)           

            const countRequest = this.pool.request()
            const dataRequest = this.pool.request()

            const countWhere = buildSupplierFilter( countRequest, filter )
            const dataWhere = buildSupplierFilter( dataRequest, filter )

            const countResult = await countRequest.query(`
                SELECT COUNT(*) AS total
                FROM Supplier
                WHERE ${countWhere}   
            `)

            dataRequest.input('offset', offset).input('limit', limit )
            const dataResult = await dataRequest.query(`
                SELECT *
                FROM Supplier
                WHERE ${dataWhere}
                ORDER BY supplier_createdAt DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY   
            `)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil( total / limit )

            return {
                items: dataResult.recordset.map( SupplierMapper.fromSQL ),
                page: page,
                total: total,
                totalPages: totalPages
            }

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener todos los proveedores filtrados',
                'MSSQL_GET_FILTERED_SUPPLIERS_ERROR',
                error
            )
        }
    }
    
    async getAllSuppliers(): Promise<Supplier[]> {
        try {
            const result = await this.pool.request()
                .query(`SELECT * FROM Supplier ORDER BY supplier_createdAt DESC`)

            return result.recordset.map( SupplierMapper.fromSQL )
        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener todos los proveedores',
                'MSSQL_GET_ALL_SUPPLIERS_ERROR',
                error
            )
        }
    }

    async getUniqueCompanies(): Promise<string[]> {
        try {
            const result = await this.pool.request()
                .query(`
                    SELECT DISTINCT supplier_company AS company
                    FROM Supplier
                    ORDER BY company DESC   
                `)

            const companyNames = result.recordset.map( c => c.company )

            return companyNames
        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener las empresas de los proveedores',
                'MSSQL_GET_SUPPLIER_COMPANIES_ERROR',
                error
            )
        }
    }
}