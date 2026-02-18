import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { CategoryDatasource } from "../../../domain/datasources";
import { Category } from "../../../domain/entities";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { MssqlClient } from "./mssql-client";
import { buildMssqlPaginationOptions } from "./utils/mssql-pagination-options";

export class MSSQLCategory implements CategoryDatasource {

    private toDomain(categoryData: any): Category {
        return new Category({
            id: categoryData.category_id,
            name: categoryData.category_name,
            description: categoryData.category_description,
            icon: categoryData.category_icon,
            isActive: categoryData.category_is_active,
            createdAt: categoryData.category_createdAt,
            updatedAt: categoryData.category_updatedAt
        });
    }

    async findById(categoryId: string): Promise<Category | null> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('category_id', categoryId )
                .query(`
                    SELECT *
                    FROM Category
                    WHERE category_id = @category_id    
                `)

            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener la categoría por id',
                'MSSQL_FIND_CATEGORY_BY_ID_ERROR',
                error
            )
        }
    }

    async exists(categoryName: string): Promise<boolean> {
        try {
            const pool = await MssqlClient.getConnection()
            const result = await pool.request()
                .input('category_name', categoryName )
                .query(`
                    SELECT *
                    FROM Category
                    WHERE category_name = @category_name
                `)
            
            if ( result.recordset[0] ) return true
            return false
        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener la categoría por nombre',
                'MSSQL_FIND_CATEGORY_BY_ID_ERROR',
                error
            )
        }
    }
    
    async findByName(categoryName: string): Promise<Category | null> {
        try {
            const pool = await MssqlClient.getConnection()
            const result = await pool.request()
                .input('category_name', `%${categoryName}%`)
                .query(`
                    SELECT *
                    FROM Category
                    WHERE category_name LIKE @category_name    
                `)
            
            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )

        } catch ( error ) {
            throw new InfrastructureError(
                'Error al buscar la categoría por nombre',
                'MSSQL_FIND_CATEGORY_BY_NAME_ERROR',
                error
            )
        }
    }
    
    async create(category: Category): Promise<Category> {
        try {

            const pool = await MssqlClient.getConnection()
            
            const result = await pool.request()
                .input('category_id', category.id )
                .input('category_name', category.name )
                .input('category_description', category.description )
                .input('category_icon', category.icon )
                .input('category_is_active', category.isActive )
                .input('category_createdAt', category.createdAt )
                .input('category_updatedAt', category.updatedAt )
                .query(`
                    INSERT INTO Category (
                        category_id,
                        category_name,
                        category_description,
                        category_icon,
                        category_is_active,
                        category_createdAt,
                        category_updatedAt
                    )
                    OUTPUT INSERTED.*
                    VALUES (
                        @category_id,
                        @category_name,
                        @category_description,
                        @category_icon,
                        @category_is_active,
                        @category_createdAt,
                        @category_updatedAt
                    )    
                `)
            
            return this.toDomain( result.recordset[0] )
        } catch( error ) {
            throw new InfrastructureError(
                'Error al crear nueva categoría',
                'MSSQL_CREATE_CATEGORY_ERROR',
                error
            )
        }
    }
    
    async update(category: Category): Promise<Category> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('category_id', category.id )
                .input('category_name', category.name )
                .input('category_description', category.description )
                .input('category_icon', category.icon )
                .input('category_updatedAt', category.updatedAt )
                .query(`
                    UPDATE Category
                    SET 
                        category_name = @category_name,
                        category_description = @category_description,
                        category_icon = @category_icon,
                        category_updatedAt = @category_updatedAt
                    OUTPUT INSERTED.*
                    WHERE category_id = @category_id
                `)

            return this.toDomain( result.recordset[0] )
        } catch(error) {
            throw new InfrastructureError(
                'Error al actualizar la categoría',
                'MSSQL_UPDATE_CATEGORY_ERROR',
                error
            )
        }
    }
    
    async changeStatus(categoryId: string, status: boolean): Promise<Category> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('category_id', categoryId )
                .input('status', status )
                .query(`
                    UPDATE Category
                    SET category_is_active = @status
                    OUTPUT INSERTED.*
                    WHERE category_id = @category_id
                `)

            return this.toDomain( result.recordset[0] )
        } catch (error) {
            throw new InfrastructureError(
                'Error al cambiar el estado de la categoría',
                'MSSQL_UPDATE_CATEGORY_STATUS_ERROR',
                error
            )
        }
    }
    
    async getCategories(pagination: PaginationDTO): Promise<PaginationResponseDto<Category>> {
        try {

            const pool = await MssqlClient.getConnection()

            const { limit, offset, orderBy, page, where } = buildMssqlPaginationOptions( pagination )

            const [ categoryResults, countResults ] = await Promise.all([
                pool.request()
                    .input('limit', limit)
                    .input('offset', offset )
                    .query(`
                        SELECT *
                        FROM Category
                        WHERE ${where}
                        ORDER BY ${orderBy}
                        OFFSET @offset ROWS
                        FETCH NEXT @limit ROWS ONLY    
                    `),

                pool.request()
                    .query(`SELECT COUNT(*) AS total FROM Category WHERE ${where}`)
            ])

            const total = countResults.recordset[0].total
            const totalPages = Math.ceil( total / limit )

            return {
                items: categoryResults.recordset.map( this.toDomain ),
                page: page,
                total: total,
                totalPages: totalPages
            }

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener las categorías',
                'MSSQL_GET_CATEGORIES_ERROR',
                error
            )
        }
    }
    
    async getAllCategories(): Promise<Category[]> {
        try {
            const pool = await MssqlClient.getConnection()
            const result = await pool.request().query(`SELECT * FROM Category ORDER BY category_createdAt DESC`)
            return result.recordset.map( this.toDomain )
        } catch (error ) {
            throw new InfrastructureError(
                'Error al obtener todas las categorías',
                'MSSQL_GET_ALL_CATEGORIES_ERROR',
                error
            )
        }
    }

}