import { ConnectionPool } from "mssql";
import { FilterCategories, PaginationDTO, PaginationResponseDto } from "../../../../application/dtos/pagination.dto";
import { CategoryDatasource } from "../../../../domain/datasources";
import { Category } from "../../../../domain/entities";
import { InfrastructureError } from "../../../errors/infrastructure-error";
import { CategoryMapper } from "../mappers";
import { buildCategoriesFilter, buildMssqlPaginationOptions } from "../utils";

export class MSSQLCategory implements CategoryDatasource {

    constructor(private readonly pool: ConnectionPool){}

    async findById(categoryId: string): Promise<Category | null> {
        try {
            const result = await this.pool.request()
                .input('category_id', categoryId )
                .query(`
                    SELECT *
                    FROM Category
                    WHERE category_id = @category_id    
                `)

            if ( !result.recordset[0] ) return null
            return CategoryMapper.fromSQL( result.recordset[0] )

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
            const result = await this.pool.request()
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
            const result = await this.pool.request()
                .input('category_name', `%${categoryName}%`)
                .query(`
                    SELECT *
                    FROM Category
                    WHERE category_name LIKE @category_name    
                `)
            
            if ( !result.recordset[0] ) return null
            return CategoryMapper.fromSQL( result.recordset[0] )

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

            
            const result = await this.pool.request()
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
            
            return CategoryMapper.fromSQL( result.recordset[0] )
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

            const result = await this.pool.request()
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

            return CategoryMapper.fromSQL( result.recordset[0] )
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

            const result = await this.pool.request()
                .input('category_id', categoryId )
                .input('status', status )
                .query(`
                    UPDATE Category
                    SET category_is_active = @status
                    OUTPUT INSERTED.*
                    WHERE category_id = @category_id
                `)

            return CategoryMapper.fromSQL( result.recordset[0] )
        } catch (error) {
            throw new InfrastructureError(
                'Error al cambiar el estado de la categoría',
                'MSSQL_UPDATE_CATEGORY_STATUS_ERROR',
                error
            )
        }
    }

    
    async filterCategories(pagination: PaginationDTO, filter: FilterCategories ): Promise<PaginationResponseDto<Category>> {
        try {

            const { page, limit, offset } = buildMssqlPaginationOptions(pagination)
            
            const countRequest = this.pool.request()
            const dataRequest = this.pool.request()

            const countWhere = buildCategoriesFilter(countRequest, filter)
            const dataWhere = buildCategoriesFilter(dataRequest, filter)

            const countResult = await countRequest.query(`
                SELECT COUNT(*) AS total
                FROM Category
                WHERE ${countWhere}
            `)

            console.log(dataWhere)
            
            dataRequest.input('offset', offset).input('limit', limit)
            const dataResult = await dataRequest.query(`
                SELECT *
                FROM Category
                WHERE ${dataWhere}
                ORDER BY category_createdAt DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY  
            `)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil( total / limit )
            
            return {
                items: dataResult.recordset.map( CategoryMapper.fromSQL ),
                page: page,
                total: total,
                totalPages: totalPages
            }

        } catch ( error ) {
             throw new InfrastructureError(
                'Error al obtener las categorias filtradas',
                'MSSQL_FILTER_CATEGORY_ERROR',
                error
            )
        }
    }
    
    async getAllCategories(): Promise<Category[]> {
        try {
            const result = await this.pool.request().query(`SELECT * FROM Category ORDER BY category_createdAt DESC`)
            return result.recordset.map( CategoryMapper.fromSQL )
        } catch (error ) {
            throw new InfrastructureError(
                'Error al obtener todas las categorías',
                'MSSQL_GET_ALL_CATEGORIES_ERROR',
                error
            )
        }
    }

}