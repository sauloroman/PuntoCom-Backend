import { PrismaClient, Category as PrismaCategory } from "../../../../generated/prisma";
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { CategoryDatasource } from "../../../domain/datasources/category.datasource";
import { Category } from "../../../domain/entities";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { buildPaginationOptions } from "./utils/pagination-options";

export class PrismaCategoryDatasource implements CategoryDatasource {

    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient){
        this.prisma = prisma
    }

    async findById(categoryId: string): Promise<Category | null> {
        try {
            const category = await this.prisma.category.findUnique({ where: { category_id: categoryId }})
            if ( !category ) return null
            return this.toDomain(category)
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al obtener la categoría por id',
                'PRISMA_FIND_CATEGORY_BY_ID_ERROR',
                 error
            );
        }
    }

    async findByName(categoryName: string): Promise<Category | null> {
        try {   
            const category = await this.prisma.category.findUnique({ where: { category_name: categoryName }})
            if ( !category ) return null
            return this.toDomain( category )
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al obtener la categoría por nombre',
                'PRISMA_FIND_CATEGORY_BY_NAME_ERROR',
                 error
            );
        }
    }

    async create(category: Category): Promise<Category> {
        try {   
            const categoryCreated = await this.prisma.category.create( { data: this.toPrisma( category ) } )
            return this.toDomain( categoryCreated )
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al crear la categoría',
                'PRISMA_CREATE_CATEGORY_ERROR',
                 error
            );
        }
    }

    async update(category: Category): Promise<Category> {
        try {
            const categoryUpdated = await this.prisma.category.update({
                where: { category_id: category.id },
                data: this.toPrisma(category)
            })
            return this.toDomain( categoryUpdated )
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al actualizar la categoría',
                'PRISMA_CREATE_CATEGORY_ERROR',
                 error
            );
        }
    }

    async changeStatus(categoryId: string, status: boolean): Promise<Category> {
        try {
            const categoryUpdated = await this.prisma.category.update({
                where: { category_id: categoryId },
                data: { category_is_active: status }
            })
            return this.toDomain( categoryUpdated )
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al actualizar la categoría',
                'PRISMA_CREATE_CATEGORY_ERROR',
                 error
            );
        }
    }

    async getCategories(pagination: PaginationDTO): Promise<PaginationResponseDto<Category>> {
        try {

            const { limit, orderBy, page, skip, take, where } = buildPaginationOptions(pagination)

            const [ categories, total ] = await Promise.all([
                this.prisma.category.findMany({ where, skip, take, orderBy }),
                this.prisma.category.count({ where })
            ])

            const totalPages = Math.ceil( total / limit )

            return {
                items: categories.map( this.toDomain ),
                total,
                page,
                totalPages
            }

        } catch(error) {
            throw new InfrastructureError(
                '[Prisma]: Error al obtener las categorías',
                'PRISMA_FIND_USERS_BY_FILTER_ERROR',
                error
            );
        }
    }

    private toDomain(categoryData: PrismaCategory): Category {
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
    
      private toPrisma(category: Category): Omit<PrismaCategory, 'category_id' | 'category_createdAt' | 'category_updatedAt'> {
        return {
          category_name: category.name,
          category_description: category.description,
          category_icon: category.icon,
          category_is_active: category.isActive
        };
      }
}