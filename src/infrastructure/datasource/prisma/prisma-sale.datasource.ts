import { PrismaClient, Sale as PrismaSale, User as PrismaUser, Sale_Product_Detail as PrismaSaleDetail, Product as PrismaProduct } from "../../../../generated/prisma";
import { Decimal } from "../../../../generated/prisma/runtime/library";
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { SaleDetailsResponse, SaleFilters, SaleProductDetailResponse, SaleResponse } from "../../../application/dtos/sale.dto";
import { DatesAdapter } from "../../../config/plugins";
import { SalesDatasource } from "../../../domain/datasources/sales.datasource";
import { Sale, SaleProductDetail } from "../../../domain/entities";
import { Money, Quantity } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { buildPaginationOptions } from "./utils/pagination-options";

export class PrismaSalesDatasource implements SalesDatasource {
    
    private readonly prisma: PrismaClient

    constructor( prisma: PrismaClient ) {
        this.prisma = prisma
    }

    async findByUser(userId: string, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        try {

            const { page, take, skip, orderBy, where, limit } = buildPaginationOptions( pagination )

            const userWhere = {
                ...where,
                user_id: userId
            }

            const [ sales, total ] = await Promise.all([
                this.prisma.sale.findMany({
                    where: userWhere,
                    skip,
                    take,
                    orderBy,
                    include: {
                        User: true,
                        SaleProductDetails: {
                            include: {
                                Product: true
                            }
                        }
                    }
                }),
                this.prisma.sale.count({ where: userWhere })
            ])

            const totalPages = Math.ceil( total / limit )

            const salesWithDetails: SaleDetailsResponse[] = sales.map( sale => ({
                id: sale.sale_id,
                total: new Money(parseFloat(`${sale.sale_total}`)).value,
                date: DatesAdapter.formatLocal(sale.sale_date),
                code: sale.sale_code,
                User: sale.User && {
                    id: sale.User.user_id,
                    name: `${sale.User.user_name} ${sale.User.user_lastname}`,
                    role: sale.User.role,
                    image: sale.User.user_image,
                },
                details: sale.SaleProductDetails.map(this.toDomainSaleDetail)
            }))

            return {
                items: salesWithDetails,
                page,
                total,
                totalPages
            }

        } catch( erorr ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener ventas del usuario',
                'PRISMA_GET_SALES_BY_USER_ERROR'
            )
        }
    }

    async getFilteredSales(filter: SaleFilters, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        try {
             
            const { page, limit, orderBy, where, skip, take } = buildPaginationOptions(pagination)
            const filterWhere = this.buildWhereClause(where, filter)

            const [sales, total] = await Promise.all([
                this.prisma.sale.findMany({
                    where: filterWhere,
                    skip,
                    take,
                    orderBy,
                    include: {
                        User: true,
                        SaleProductDetails: {
                            include: {
                                Product: true
                            }
                        }
                    }
                }),
                this.prisma.sale.count({ where: filterWhere })
            ])

            const totalPages = Math.ceil( total / limit )

            const salesWithDetails: SaleDetailsResponse[] = sales.map( sale => ({
                id: sale.sale_id,
                total: new Money(parseFloat(`${sale.sale_total}`)).value,
                date: DatesAdapter.formatLocal(sale.sale_date),
                code: sale.sale_code,
                User: sale.User && {
                    id: sale.User.user_id,
                    name: `${sale.User.user_name} ${sale.User.user_lastname}`,
                    role: sale.User.role,
                    image: sale.User.user_image,
                },
                details: sale.SaleProductDetails.map(this.toDomainSaleDetail)
            }))

            return {
                items: salesWithDetails,
                page,
                total,
                totalPages
            }

        } catch(error) {
            throw new InfrastructureError(
                '[PRISMA]: Error al filtrar las ventas',
                'PRISMA_FILTER_SALES_ERROR'
            ) 
        }
    }

    async getFilteredSalesByUser(userId: string, filter: SaleFilters, pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        try {

            const { page, limit, orderBy, where, skip, take } = buildPaginationOptions(pagination)

            const filterWhere = this.buildWhereClause({ ...where, user_id: userId }, filter)

            const [ sales, total ] = await Promise.all([
                this.prisma.sale.findMany({
                    where: filterWhere,
                    skip,
                    take,
                    orderBy,
                    include: {
                        User: true,
                        SaleProductDetails: {
                            include: {
                                Product: true
                            }
                        }
                    }
                }),
                this.prisma.sale.count({ where: filterWhere })
            ])

            const totalPages = Math.ceil( total / limit )

            const salesWithDetails: SaleDetailsResponse[] = sales.map( sale => ({
                id: sale.sale_id,
                total: new Money(parseFloat(`${sale.sale_total}`)).value,
                date: DatesAdapter.formatLocal(sale.sale_date),
                code: sale.sale_code,
                User: sale.User && {
                    id: sale.User.user_id,
                    name: `${sale.User.user_name} ${sale.User.user_lastname}`,
                    role: sale.User.role,
                    image: sale.User.user_image,
                },
                details: sale.SaleProductDetails.map(this.toDomainSaleDetail)
            }))

            return {
                items: salesWithDetails,
                page,
                total,
                totalPages
            }

        } catch( error ){
            throw new InfrastructureError(
                '[PRISMA]: Error al filtrar las ventas por usuario',
                'PRISMA_FILTER_SALES_BY_USER_ERROR'
            )
        }
    }

    async getSales(pagination: PaginationDTO): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        try {
            
            const { limit, orderBy, page, skip, take, where } = buildPaginationOptions(pagination)

            const [ sales, total ] = await Promise.all([
                this.prisma.sale.findMany({ 
                    where, 
                    skip, 
                    take, 
                    orderBy, 
                    include: { 
                        User: true, 
                        SaleProductDetails: {
                            include: {
                                Product: true
                            }
                        }  
                    }}),
                this.prisma.sale.count({ where })
            ])

            const totalPages = Math.ceil( total / limit )

            const salesWithDetails: SaleDetailsResponse[] = sales.map( sale => ({
                id: sale.sale_id,
                total: new Money(parseFloat(`${sale.sale_total}`)).value,
                date: DatesAdapter.formatLocal(sale.sale_date),
                code: sale.sale_code,
                User: sale.User && {
                    id: sale.User.user_id,
                    name: `${sale.User.user_name} ${sale.User.user_lastname}`,
                    role: sale.User.role,
                    image: sale.User.user_image,
                },
                details: sale.SaleProductDetails.map(this.toDomainSaleDetail)
            }))

            return {
                items: salesWithDetails,
                page,
                total, 
                totalPages
            }

        } catch(error) {
            throw new InfrastructureError(
                '[PRISMA]: Error al listar las ventas',
                'PRISMA_GET_ALL_SALES_ERROR'
            )
        }
    }

    async saveSaleDetails(data: SaleProductDetail): Promise<SaleProductDetailResponse> {
        try {
            const detail = await this.prisma.sale_Product_Detail.create({
                data: this.toPrismaSaleDetail( data ),
                include: {
                    Product: true 
                },
            })
            return this.toDomainSaleDetail(detail)
        } catch(error) {
            throw new InfrastructureError(
                '[PRISMA]: Error al crear el detalle de la venta',
                'PRISMA_CREATE_SALE_ERROR'
            )
        }
    }

    async saveSale(sale: Sale): Promise<SaleResponse> {
        try {
            const saleCreated = await this.prisma.sale.create({ 
                data: this.toPrisma(sale) ,
                include: {
                    User: true
                }
            })
            return this.toDomain( saleCreated )
        } catch(error) {
            throw new InfrastructureError(
                '[PRISMA]: Error al crear la venta',
                'PRISMA_CREATE_SALE_ERROR'
            )
        }
    }
    
    async findById(id: string): Promise<SaleResponse | null> {
        try {

            const sale = await this.prisma.sale.findUnique({
                where: { sale_id: id },
                include: {
                    User: true
                }
            })
            if ( !sale ) return null
            return this.toDomain( sale )

        } catch(error) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener la venta',
                'PRISMA_GET_SALE_BY_ID_ERROR'
            )
        }
    }

    private toDomain( saleData: PrismaSale & { User?: PrismaUser } ): SaleResponse {
        return {
            id: saleData.sale_id,
            total: new Money(parseFloat(`${saleData.sale_total}`)).value,
            date: saleData.sale_date,
            code: saleData.sale_code,
            User: saleData.User && {
                id: saleData.User.user_id,
                name: `${saleData.User.user_name} ${saleData.User.user_lastname}`,
                role: saleData.User.role
            }
        }
    }

    private toDomainSaleDetail( saleDetailData: PrismaSaleDetail & {Product: PrismaProduct} ): SaleProductDetailResponse {
        return {
            id: saleDetailData.sale_product_detail_id,
            saleQuantity: saleDetailData.sale_product_detail_quantity,
            saleUnitPrice: new Money(parseFloat(`${saleDetailData.sale_product_detail_unit_price}`)).value,
            saleDiscount: new Money(parseFloat(`${saleDetailData.sale_product_discount}`)).value,
            productId: saleDetailData.product_id,
            saleId: saleDetailData.sale_id,
            Product: saleDetailData.Product && {
                id: saleDetailData.Product.product_id,
                name: saleDetailData.Product.product_name,
                code: saleDetailData.Product.product_code
            }
        }
    }

    private toPrisma( sale: Sale ): Omit<PrismaSale, 'sale_id' | 'sale_createdAt' | 'sale_updatedAt'> {
        return {
            sale_code: sale.code.value,
            sale_date: sale.date,
            sale_total: new Decimal( sale.total.value ),
            user_id: sale.userId,
        }
    }

    private toPrismaSaleDetail( saleDetail: SaleProductDetail ): Omit<PrismaSaleDetail, 'sale_product_detail_id'> {
        return {
            sale_product_detail_quantity: new Quantity( saleDetail.saleQuantity.value ).value,
            sale_product_detail_unit_price: new Decimal(saleDetail.saleUnitPrice.value),
            sale_product_discount: new Decimal(saleDetail.saleDiscount.value),
            product_id: saleDetail.productId,
            sale_id: saleDetail.saleId
        };
    }

    private buildWhereClause( baseWhere: any, filters: SaleFilters ) {
        const where = { ...baseWhere }

        if ( filters.prices ) {
            where.sale_total = {
                gte: filters.prices.priceMin,
                lte: filters.prices.priceMax
            }
        }

        if ( filters.dates ) {
            const adjustedDateTo = new Date( filters.dates.dateTo )
            adjustedDateTo.setHours(23, 59, 59, 999)
            
            where.sale_date = {
                gte: filters.dates.dateFrom,
                lte: adjustedDateTo
            }
        }

        return where
    }

}