import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { UserDatasource } from "../../../domain/datasources";
import { User } from "../../../domain/entities";
import { Email, Password, Phone } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { Role, RoleEnum } from "../../../domain/value-objects/Role";
import { MssqlClient } from "./mssql-client";
import { buildMssqlPaginationOptions } from "./utils/mssql-pagination-options";

export class MSSQLUsers implements UserDatasource {

    private toDomain(userData: any): User {
        return new User({
          id: userData.user_id,
          name: userData.user_name,
          lastname: userData.user_lastname,
          image: userData.user_image,
          email: new Email(userData.user_email),
          phone: new Phone(userData.user_phone),
          password: new Password(userData.user_password),
          role: new Role(userData.role as RoleEnum),
          isActive: userData.user_is_active,
          isValidated: userData.user_is_validated,
          createdAt: userData.user_createdAt,
          updatedAt: userData.user_updatedAt
        });
      }

    async findById(userId: string): Promise<User | null> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('user_id', userId)
                .query(`SELECT * FROM [User] WHERE user_id = @user_id`)

            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )

        } catch( error ) {
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

            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('user_email', email)
                .query(`SELECT * FROM [User] WHERE user_email = @user_email`)

            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener el usuario por email',
                'MSSQL_FIND_USER_BY_EMAIL_ERROR',
                error
            )
        }
    }
    
    async create(user: User): Promise<User> {
        try {

            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
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
            
            return this.toDomain(result.recordset[0])

        } catch( error ) {
            throw new InfrastructureError(
                'Error al crear nuevo usuario',
                'MSSQL_CREATE_USER_ERROR',
                error
            )
        }
    }
    
    async update(user: User): Promise<User> {
        try {

            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('user_id', user.id)
                .input('user_name', user.name)
                .input('user_lastname', user.lastname)
                .input('user_image', user.image)
                .input('user_email', user.email.value)
                .input('user_phone', user.phone.value)
                .input('user_is_validated', user.isValidated )
                .input('user_is_active', user.isActive )
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
                        user_is_active = @user_is_active,
                        role = @role
                    OUTPUT INSERTED.*
                    WHERE user_id = @user_id
                `)

            return this.toDomain(result.recordset[0])

        } catch ( error ) {
            throw new InfrastructureError(
                'Error al actualizar al usuario',
                'MSSQL_UPDATE_USER_ERROR',
                error
            )
        }
    }
    
    async changeStatus(userId: string, status: boolean): Promise<User> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('user_id', userId)
                .input('user_is_active', status)
                .query(`
                    UPDATE [User]
                    SET user_is_active = @user_is_active
                    OUTPUT INSERTED.*
                    WHERE user_id = @user_id
                `)

            return this.toDomain( result.recordset[0] )
        } catch( error ) {
            throw new InfrastructureError(
                'Error al cambiar el estado del usuario',
                'MSSQL_UPDATE_USER_ERROR',
                error
            )
        }
    }
    
    async getUsers(pagination: PaginationDTO): Promise<PaginationResponseDto<User>> {
        try {
            const pool = await MssqlClient.getConnection()
            const { page, limit, orderBy, offset, where } = buildMssqlPaginationOptions( pagination )
            
            const [ usersResults, countResult ] = await Promise.all([
                pool.request()
                    .input('limit', limit)
                    .input('offset', offset)
                    .query(`
                        SELECT * FROM [User]
                        WHERE ${where}
                        ORDER BY ${orderBy}
                        OFFSET @offset ROWS
                        FETCH NEXT @limit ROWS ONLY    
                    `),
                
                pool.request()
                    .query(`SELECT COUNT(*) FROM [User] WHERE ${where}`)
            ])

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil( total / limit )

            return {
                items: usersResults.recordset.map( this.toDomain ),
                page: page,
                total: total,
                totalPages: totalPages
            }

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener los usuarios',
                'MSSQL_UPDATE_USER_ERROR',
                error
            )
        }
    }
    
    async getAllUsers(): Promise<User[]> {
        try {
            const pool = await MssqlClient.getConnection() 
            const result = await pool.request().query(`SELECT * FROM [User] ORDER BY user_createdAt DESC`)
            return result.recordset.map( this.toDomain )
        } catch( error ) {
             throw new InfrastructureError(
                'Error al obtener todos los usuarios',
                'MSSQL_UPDATE_USER_ERROR',
                error
            )
        }
    }
}