import { PrismaClient, Category as PrismaCategory } from "../../../../generated/prisma";
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { CategoryDatasource } from "../../../domain/datasources/category.datasource";
import { Category } from "../../../domain/entities";
import { InfrastructureError } from "../../errors/infrastructure-error";

export class PrismaCategoryDatasource implements CategoryDatasource {

    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient){
        this.prisma = prisma
    }

    async findById(categoryId: string): Promise<Category | null> {
        throw new Error("Method not implemented.");
    }

    async findByName(categoryName: string): Promise<Category | null> {
        try {   
            const category = await this.prisma.category.findUnique({ where: { category_name: categoryName }})
            if ( !category ) return null
            return this.toDomain( category )
        } catch( error ) {
            throw new InfrastructureError(
                '[Prisma]: Error al obtener la categoría por nombre',
                'PRISMA_FIND_USERS_BY_FILTER_ERROR',
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
                'PRISMA_FIND_USERS_BY_FILTER_ERROR',
                 error
            );
        }
    }

    async update(category: Category): Promise<Category> {
        throw new Error("Method not implemented.");
    }

    async changeStatus(categoryId: string, status: boolean): Promise<Category> {
        throw new Error("Method not implemented.");
    }

    async getCategories(pagination: PaginationDTO): Promise<PaginationResponseDto<Category>> {
        throw new Error("Method not implemented.");
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