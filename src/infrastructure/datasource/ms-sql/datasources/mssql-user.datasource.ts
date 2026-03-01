import { ConnectionPool } from "mssql";
import { PaginationDTO, PaginationResponseDto } from "../../../../application/dtos/pagination.dto";
import { UserDatasource } from "../../../../domain/datasources";
import { User } from "../../../../domain/entities";
import { Email } from "../../../../domain/value-objects";
import { InfrastructureError } from "../../../errors/infrastructure-error";
import { FilterUsers } from "../../../../application/dtos/user.dto";
import { UserMapper } from "../mappers";
import { buildMssqlPaginationOptions, buildUserFilter } from "../utils";

export class MSSQLUsers implements UserDatasource {

    constructor(private readonly pool: ConnectionPool) { }

    async findById(userId: string): Promise<User | null> {
        try {
            const result = await this.pool.request()
                .input('user_id', userId)
                .query(`SELECT * FROM [User] WHERE user_id = @user_id`)

            if (!result.recordset[0]) return null
            return UserMapper.fromSQL(result.recordset[0])

        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener el usuario por id',
                'MSSQL_FIND_USER_BY_ID_ERROR',
                error
            )
        }
    }

    async findByEmail(userEmail: Email): Promise<User | null> {
        try {

            const email = userEmail.value

            const result = await this.pool.request()
                .input('user_email', email)
                .query(`SELECT * FROM [User] WHERE user_email = @user_email`)

            if (!result.recordset[0]) return null
            return UserMapper.fromSQL(result.recordset[0])

        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener el usuario por email',
                'MSSQL_FIND_USER_BY_EMAIL_ERROR',
                error
            )
        }
    }

    async create(user: User): Promise<User> {
        try {
            const result = await this.pool.request()
                .input('user_id', user.id)
                .input('user_name', user.name)
                .input('user_lastname', user.lastname)
                .input('user_image', user.image)
                .input('user_email', user.email.value)
                .input('user_password', user.password.value)
                .input('user_is_active', user.isActive)
                .input('user_is_validated', user.isValidated)
                .input('user_phone', user.phone.value)
                .input('role', user.role.value)
                .query(`
                    INSERT INTO [User] (
                        user_id,
                        user_name,
                        user_lastname,
                        user_image,
                        user_email,
                        user_password,
                        user_is_active,
                        user_is_validated,
                        user_phone,
                        role
                    ) 
                    OUTPUT INSERTED.*
                    VALUES (
                        @user_id,
                        @user_name, 
                        @user_lastname,
                        @user_image,
                        @user_email,
                        @user_password,
                        @user_is_active,
                        @user_is_validated,
                        @user_phone,
                        @role
                    )
                `)

            return UserMapper.fromSQL(result.recordset[0])

        } catch (error) {
            throw new InfrastructureError(
                'Error al crear nuevo usuario',
                'MSSQL_CREATE_USER_ERROR',
                error
            )
        }
    }

    async update(user: User): Promise<User> {
        try {
            const result = await this.pool.request()
                .input('user_id', user.id)
                .input('user_name', user.name)
                .input('user_lastname', user.lastname)
                .input('user_image', user.image)
                .input('user_email', user.email.value)
                .input('user_phone', user.phone.value)
                .input('user_is_validated', user.isValidated)
                .input('user_updatedAt', user.updatedAt)
                .input('role', user.role.value)
                .query(`
                    UPDATE [User]
                    SET
                        user_name = @user_name,
                        user_lastname = @user_lastname,
                        user_image = @user_image,
                        user_email = @user_email,
                        user_phone = @user_phone,
                        user_is_validated = @user_is_validated,
                        user_updatedAt = @user_updatedAt,
                        role = @role
                    OUTPUT INSERTED.*
                    WHERE user_id = @user_id
                `)

            return UserMapper.fromSQL(result.recordset[0])

        } catch (error) {
            throw new InfrastructureError(
                'Error al actualizar al usuario',
                'MSSQL_UPDATE_USER_ERROR',
                error
            )
        }
    }

    async changeStatus(userId: string, status: boolean): Promise<User> {
        try {
            const result = await this.pool.request()
                .input('user_id', userId)
                .input('user_is_active', status)
                .query(`
                    UPDATE [User]
                    SET user_is_active = @user_is_active
                    OUTPUT INSERTED.*
                    WHERE user_id = @user_id
                `)

            return UserMapper.fromSQL(result.recordset[0])
        } catch (error) {
            throw new InfrastructureError(
                'Error al cambiar el estado del usuario',
                'MSSQL_UPDATE_USER_STATUS_ERROR',
                error
            )
        }
    }

    async filterUsers(pagination: PaginationDTO, filter: FilterUsers): Promise<PaginationResponseDto<User>> {
        try {
            const { page, limit, offset } = buildMssqlPaginationOptions(pagination)

            const countRequest = this.pool.request()
            const dataRequest = this.pool.request()

            const countWhere = buildUserFilter(countRequest, filter)
            const dataWhere = buildUserFilter(dataRequest, filter)

            const countResult = await countRequest.query(`
                SELECT COUNT(*) AS total
                FROM [User] 
                WHERE ${countWhere}    
            `)

            dataRequest.input('offset', offset).input('limit', limit)
            const dataResult = await dataRequest.query(`
                SELECT * 
                FROM [User]
                WHERE ${dataWhere}
                ORDER BY user_createdAt DESC
                OFFSET @offset ROWS 
                FETCH NEXT @limit ROWS ONLY
            `)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil(total / limit)

            return {
                items: dataResult.recordset.map(UserMapper.fromSQL),
                page: page,
                total: total,
                totalPages: totalPages
            }

        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener los usuarios filtrados',
                'MSSQL_FILTER_USER_ERROR',
                error
            )
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const result = await this.pool.request().query(`SELECT * FROM [User] ORDER BY user_createdAt DESC`)
            return result.recordset.map(UserMapper.fromSQL)
        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener todos los usuarios',
                'MSSQL_UPDATE_USER_ERROR',
                error
            )
        }
    }
}