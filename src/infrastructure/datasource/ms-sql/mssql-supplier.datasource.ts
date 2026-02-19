import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { SupplierDatasource } from "../../../domain/datasources";
import { Supplier } from "../../../domain/entities";
import { Email, Phone } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { MssqlClient } from "./mssql-client";
import { buildMssqlPaginationOptions } from "./utils/mssql-pagination-options";

export class MSSQLSuppliers implements SupplierDatasource {
    
    private toDomain(supplierData: any): Supplier {
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

    async findById(supplierId: string): Promise<Supplier | null> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('supplier_id', supplierId)
                .query(`
                    SELECT *
                    FROM Supplier
                    WHERE supplier_id = @supplier_id
                `)
                
            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )

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
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('supplier_email', supplierEmail)
                .query(`
                    SELECT * 
                    FROM Supplier
                    WHERE supplier_email = @supplier_email    
                `)

            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )
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

            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
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

            return this.toDomain( result.recordset[0] )
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

            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
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

            return this.toDomain( result.recordset[0] )
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
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('supplier_id', supplierId )
                .input('status', status)
                .query(`
                    UPDATE Supplier
                    SET supplier_is_active = @status
                    OUTPUT INSERTED.*
                    WHERE supplier_id = @supplier_id    
                `)

            return this.toDomain(result.recordset[0])
        } catch(error) {
            throw new InfrastructureError(
                'Error al cambiar el estado del proveedor',
                'MSSQL_CHANGE_SUPPLIER_STATUS_ERROR',
                error
            )
        }
    }

    async getSuppliers(pagination: PaginationDTO): Promise<PaginationResponseDto<Supplier>> {
        try {

            const pool = await MssqlClient.getConnection()

            const { limit, offset, orderBy, page, where } = buildMssqlPaginationOptions(pagination, 'supplier') 

            const [ supplierResults, countResult ] = await Promise.all([
                pool.request()
                    .input('limit', limit )
                    .input('offset', offset )
                    .query(`
                        SELECT *
                        FROM Supplier
                        WHERE ${where}
                        ORDER BY ${orderBy}
                        OFFSET @offset ROWS
                        FETCH NEXT @limit ROWS ONLY
                    `),

                pool.request().query(`SELECT COUNT(*) AS total FROM Supplier WHERE ${where}`)
            ]) 

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil( total / limit )

            return {
                items: supplierResults.recordset.map( this.toDomain ),
                page: page,
                total: total,
                totalPages: totalPages
            }

        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener los proveedores',
                'MSSQL_GET_SUPPLIERS_ERROR',
                error
            )
        }
    }
    
    async getAllSuppliers(): Promise<Supplier[]> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .query(`SELECT * FROM Supplier ORDER BY supplier_createdAt DESC`)

            return result.recordset.map( this.toDomain )
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
            const pool = await MssqlClient.getConnection()
            const result = await pool.request()
                .query(`
                    SELECT DISTINCT supplier_company AS companies
                    FROM Supplier
                    ORDER BY companies DESC   
                `)

            return result.recordset
        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener las empresas de los proveedores',
                'MSSQL_GET_SUPPLIER_COMPANIES_ERROR',
                error
            )
        }
    }
}