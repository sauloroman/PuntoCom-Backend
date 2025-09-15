import { Decimal } from "@prisma/client/runtime/library";
import { Category as PrismaCategory, Supplier as PrismaSupplier, PrismaClient, Product as PrismaProduct } from "../../../../generated/prisma";
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { ProductDatasource } from "../../../domain/datasources/product.datasource";
import { Product } from "../../../domain/entities";
import { Money, ProductCode, Stock } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { buildPaginationOptions } from "./utils/pagination-options";
import { ProductResponseIncludeDto } from "../../../application/dtos/product.dto";

export class PrismaProductDatasource implements ProductDatasource {

    private readonly prisma: PrismaClient

    constructor( prisma: PrismaClient ){
        this.prisma = prisma
    }

    async findById(productId: string): Promise<ProductResponseIncludeDto | null> {
        try {
        
            const product = await this.prisma.product.findUnique({ 
                where: { product_id: productId },
                include: {
                    Category: true,
                    Supplier: true
                }
            })

            if ( !product ) return null
            return this.toDomain(product)
        } catch( error ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener el producto por id',
                'PRISMA_FIND_PRODUCT_BY_ID_ERROR',
                error
            )
        }
    }

    async findByName(productName: string): Promise<ProductResponseIncludeDto | null> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { product_name: productName },
                include: {
                    Category: true,
                    Supplier: true,
                }
            })
            if ( !product ) return null
            return this.toDomain(product)
        } catch( error ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener el producto por nombre',
                'PRISMA_FIND_PRODUCT_BY_NAME_ERROR',
                error
            )
        }
    }

    async create(product: Product): Promise<ProductResponseIncludeDto> {
        try {
            const createProduct = await this.prisma.product.create({
                data: this.toPrisma(product),
                include: {
                    Category: true,
                    Supplier: true
                }
            })
            return this.toDomain(createProduct)
        } catch( error ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al crear el producto',
                'PRISMA_CREATE_PRODUCT_ERROR',
                error
            )
        } 
    }

    async update(product: Product): Promise<ProductResponseIncludeDto> {
        try {
            const updatedProduct = await this.prisma.product.update({
                where: { product_id: product.id },
                data: this.toPrisma(product),
                include: {
                    Category: true,
                    Supplier: true
                }
            })
            return this.toDomain(updatedProduct)
        } catch(error) {
            throw new InfrastructureError(
                '[Prisma]: Error al actualizar el producto',
                'PRISMA_UPDATE_ERROR',
                error
            );
        }
    }

    async changeStatus(productId: string, status: boolean): Promise<ProductResponseIncludeDto> {
        try {
            const updatedProduct = await this.prisma.product.update({
                where: { product_id: productId },
                data: { product_is_active: status },
                include: {
                    Category: true,
                    Supplier: true
                }
            });
            return this.toDomain( updatedProduct )
        } catch (error) {
            throw new InfrastructureError(
                '[Prisma]: Error al cambiar el estado del producto',
                'PRISMA_DEACTIVATE_ERROR',
                error
            );
        }
    }

    async getProducts(pagination: PaginationDTO): Promise<PaginationResponseDto<ProductResponseIncludeDto>> {
        try {
        
              const { limit, orderBy, page, skip, take, where } = buildPaginationOptions(pagination)
        
              const [ products, total ] = await Promise.all([
                this.prisma.product.findMany({ where, skip, take, orderBy, include: { Category: true, Supplier: true }}),
                this.prisma.product.count({ where })
              ])
        
              const totalPages = Math.ceil(total / limit)
        
              return { 
                items: products.map(this.toDomain),
                total,
                page,
                totalPages
              }
        
            } catch( error ) {
              throw new InfrastructureError(
                '[Prisma]: Error al obtener los productos',
                'PRISMA_FIND_PRODUCTS_BY_FILTER_ERROR',
                error
              );
            }
    }

    async getAllProducts(): Promise<ProductResponseIncludeDto[]> {
        try {
            const products = await this.prisma.product.findMany({
                include: {
                    Category: true,
                    Supplier: true
                }
            })
            return products.map(this.toDomain)
        } catch(error) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener todos los productos',
                'PRISMA_FIND_USERS_ERROR',
                error
            )
        }
    }    

    private toDomain( productData: 
        PrismaProduct & { Category?: PrismaCategory, Supplier?: PrismaSupplier }
    ): ProductResponseIncludeDto {

        console.log(productData)

        return {
            id: productData.product_id,
            name: productData.product_name,
            description: productData.product_description,
            code: new ProductCode(productData.product_code).value,
            sellingPrice: new Money(parseFloat(`${productData.product_selling_price}`)).value,
            stock: new Stock(productData.product_stock).value,
            stockMin: new Stock(productData.product_stock_min).value,
            image: productData.product_image,
            createdAt: productData.product_createdAt,
            updatedAt: productData.product_updatedAt,
            isActive: productData.product_is_active,
            categoryId: productData.category_id,
            supplierId: productData.supplier_id,
            Category: productData.Category && {
                id: productData.Category.category_id,
                name: productData.Category.category_name,
                description: productData.Category.category_description,
                icon: productData.Category.category_icon,
                isActive: productData.Category.category_is_active
            },
            Supplier: productData.Supplier && {
                id: productData.Supplier.supplier_id,
                name: productData.Supplier.supplier_name,
                lastname: productData.Supplier.supplier_lastname,
                company: productData.Supplier.supplier_company,
                phone: productData.Supplier.supplier_phone,
                email: productData.Supplier.supplier_email,
                address: productData.Supplier.supplier_address,
                isActive: productData.Supplier.supplier_is_active,
            }            
        }        
        
        
    }

    private toPrisma(product: Product): Omit<PrismaProduct, 'product_id' | 'product_createdAt' | 'product_updatedAt'> {
        return {
            product_name: product.name,
            product_description: product.description,
            product_code: product.code.value,
            category_id: product.categoryId,
            product_image: product.image,
            product_is_active: product.isActive,
            product_selling_price: new Decimal(product.sellingPrice.value),
            product_stock: product.stock.value,
            product_stock_min: product.stockMin.value,
            supplier_id: product.supplierId
        }
    }

}