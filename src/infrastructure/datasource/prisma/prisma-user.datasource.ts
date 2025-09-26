import { User } from '../../../domain/entities';
import { Email, Password, Phone, Role } from '../../../domain/value-objects';
import { RoleEnum } from '../../../domain/value-objects/Role';

import { InfrastructureError } from '../../errors/infrastructure-error';

import { PrismaClient, User as PrismaUser } from '../../../../generated/prisma';
import { UserDatasource } from '../../../domain/datasources/user.datasource';
import { PaginationDTO, PaginationResponseDto } from '../../../application/dtos/pagination.dto';
import { buildPaginationOptions } from './utils/pagination-options';

export class PrismaUserDatasource implements UserDatasource {

  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany()
      return users.map( this.toDomain )
    } catch( error ) {
      throw new InfrastructureError(
        '[Prisma]: Error al obtener todos los usuarios',
        'PRISMA_FIND_USERS_ERROR',
        error
      );
    }
  }

  async getUsers(pagination: PaginationDTO): Promise<PaginationResponseDto<User>> {
    try {

      const { limit, orderBy, page, skip, take, where } = buildPaginationOptions(pagination)

      const [ users, total ] = await Promise.all([
        this.prisma.user.findMany({ where, skip, take, orderBy }),
        this.prisma.user.count({ where })
      ])

      const totalPages = Math.ceil(total / limit)

      return { 
        items: users.map(this.toDomain),
        total,
        page,
        totalPages
      }

    } catch( error ) {
      throw new InfrastructureError(
        '[Prisma]: Error al obtener los usuarios',
        'PRISMA_FIND_USERS_BY_FILTER_ERROR',
        error
      );
    }
  }

  async findById(userId: string): Promise<User | null> {
    try {
      const userData = await this.prisma.user.findUnique({ where: { user_id: userId }});
      if (!userData) return null;
      return this.toDomain(userData);
    } catch (error) {
      throw new InfrastructureError(
        '[Prisma]: Error al obtener el usuario por id',
        'PRISMA_FIND_BY_ID_ERROR',
        error
      );    
    }
  }

  async findByEmail(userEmail: Email): Promise<User | null> {
    try {
      const userData = await this.prisma.user.findUnique({ where: { user_email: userEmail.value }});
      if (!userData) return null;
      return this.toDomain(userData);
    } catch (error) {
      throw new InfrastructureError(
        '[Prisma]: Error al obtener el usuario por email',
        'PRISMA_FIND_BY_EMAIL_ERROR',
        error
      );    
    }
  }

  async create(user: User): Promise<User> {
    try {
      const createdUser = await this.prisma.user.create({ data: this.toPrisma(user) });
      return this.toDomain( createdUser )
    } catch (error) {
      throw new InfrastructureError(
        '[Prisma]: Error al crear el usuario',
        'PRISMA_CREATE_ERROR',
        error
      );
    }
  }

  async update(user: User): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({ 
        where: { user_id: user.id }, 
        data: this.toPrisma(user)
      });
      return this.toDomain( updatedUser )
    } catch (error) {
      throw new InfrastructureError(
        '[Prisma]: Error al actualizar el usuario',
        'PRISMA_UPDATE_ERROR',
        error
      );
    }
  }

  async changeStatus(userId: string, status: boolean): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { user_id: userId },
        data: { user_is_active: status }
      });
      return this.toDomain( updatedUser )
    } catch (error) {
      throw new InfrastructureError(
        '[Prisma]: Error al cambiar el estado del usuario',
        'PRISMA_DEACTIVATE_ERROR',
        error
      );
    }
  }

  private toDomain(userData: PrismaUser): User {
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

  private toPrisma(user: User): Omit<PrismaUser, 'user_id' | 'user_createdAt' | 'user_updatedAt'> {
    return {
      user_name: user.name,
      user_phone: user.phone.value,
      user_lastname: user.lastname,
      user_email: user.email.value,
      user_password: user.password.value,
      role: user.role.value,
      user_is_active: user.isActive,
      user_is_validated: user.isValidated,
      user_image: user.image,
    };
  }
}
