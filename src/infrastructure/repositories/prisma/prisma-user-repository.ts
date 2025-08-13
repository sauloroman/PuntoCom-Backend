import { User } from '../../../domain/entities';
import { Email, Password, Role } from '../../../domain/value-objects';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { RoleEnum } from '../../../domain/value-objects/Role';

import { InfrastructureError } from '../../errors/infrastructure-error';

import { PrismaClient, User as PrismaUser } from '../../../../generated/prisma';

export class PrismaUserRepository implements UserRepository {

  constructor(private readonly prisma: PrismaClient ){}

  async findById(userId: string): Promise<User | null> {
    try {
      const userData = await this.prisma.user.findUnique({ where: { user_id: userId }})
      if ( !userData ) return null
      return this.toDomain(userData)
    } catch( error ) {
      throw new InfrastructureError('[Prisma]: Error al obtener el usuario por id', error);    
    }
  }

  async findByEmail(userEmail: Email): Promise<User | null> {
    try {
      const userData = await this.prisma.user.findUnique({ where: {user_email: userEmail.value}})
      if ( !userData ) return null
      return this.toDomain(userData)
    } catch( error ) {
      throw new InfrastructureError('[Prisma]: Error al obtener el usuario por email', error);    
    }
  }

  async findAllActive(): Promise<User[]> {
    const userData = await this.prisma.user.findMany({ where: { user_is_active: true }})
    return userData.map( user => this.toDomain(user))
  }

  async findAllInactive(): Promise<User[]> {
    const userData = await this.prisma.user.findMany({ where: { user_is_active: false }})
    return userData.map(user => this.toDomain(user))
  }

  async create(user: User): Promise<void> {
    try {
      await this.prisma.user.create({ data: this.toPrisma(user) })
    } catch( error ) {
      throw new InfrastructureError('[Prisma]: Error al crear el usuario', error);    
    }
  }
  
  async update(user: User): Promise<void> {
    try {
      await this.prisma.user.update({ 
        where: { user_id: user.id }, 
        data: this.toPrisma(user) 
      })
    } catch ( error ) {
      throw new InfrastructureError('[Prisma]: Error al actualizar el usuario', error);    
    }
  }
  
  async deactivate(user: User): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { user_id: user.id },
        data: { user_is_active: false }
      })
    } catch ( error ) {
      throw new InfrastructureError('[Prisma]: Error al desactivar el usuario', error);    
    }
  }

  async activate(user: User): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { user_id: user.id },
        data: { user_is_active: true }
      })
    } catch ( error ) {
      throw new InfrastructureError('[Prisma]: Error al activar el usuario', error);    
    }
  }

  private toDomain( userData: PrismaUser ): User {
    return new User({
      id: userData.user_id,
      name: userData.user_name,
      lastname: userData.user_lastname,
      image: userData.user_image,
      email: new Email(userData.user_email),
      password: new Password(userData.user_password),
      role: new Role( userData.role as RoleEnum ),
      isActive: userData.user_is_active,
      createdAt: userData.user_createdAt,
      updatedAt: userData.user_updatedAt
    })
  }

  private toPrisma( user: User ): Omit<PrismaUser, 'user_id' | 'user_createdAt' | 'user_updatedAt'> {
    return {
      user_name: user.name,
      user_lastname: user.lastname,
      user_email: user.email.value,
      user_password: user.password.value,
      role: user.role.value,
      user_is_active: user.isActive,
      user_image: user.image
    }
  }

}