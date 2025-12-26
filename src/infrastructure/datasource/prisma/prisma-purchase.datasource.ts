import {PrismaClient, Purchase as PrismaPurchase, Purchase_Detail as PrismaPurchaseDetail, Product as PrismaProduct, Supplier as PrismaSupplier, User as PrismaUser } from "../../../../generated/prisma";
import { Decimal } from "../../../../generated/prisma/runtime/library";
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { PurchaseDetailResponse, PurchaseDetailsReponse, PurchaseFilters, PurchaseResponse } from "../../../application/dtos/purchase.dto";
import { DatesAdapter } from "../../../config/plugins";
import { PurchaseDatasource } from "../../../domain/datasources/purchase.datasource";
import { Purchase, PurchaseDetail } from "../../../domain/entities";
import { Money, Phone, Quantity, Role } from "../../../domain/value-objects";
import { RoleEnum } from "../../../domain/value-objects/Role";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { buildPaginationOptions } from "./utils/pagination-options";

export class PrismaPurchaseDatasource implements PurchaseDatasource {
    
    private readonly prisma: PrismaClient

    constructor( prisma: PrismaClient ) {
        this.prisma = prisma
    }

    private toDomain( purchaseData: PrismaPurchase & {User?: PrismaUser, Supplier?: PrismaSupplier } ): PurchaseResponse {
        return {
            purchaseId: purchaseData.purchase_id,
            puchaseTotal: new Money(parseFloat(`${purchaseData.purchase_total}`)).value,
            purchaseDate: DatesAdapter.formatLocal(new Date(purchaseData.purchase_date)),
            Supplier: purchaseData.Supplier && {
                supplierId: purchaseData.Supplier.supplier_id,
                supplierName: `${purchaseData.Supplier.supplier_name} ${purchaseData.Supplier.supplier_lastname}`,
                supplierPhone: new Phone(purchaseData.Supplier.supplier_phone).value
            },
            User: purchaseData.User && {
                userId: purchaseData.User.user_id,
                userName: `${purchaseData.User.user_name} ${purchaseData.User.user_lastname}`,
                userRole: new Role( purchaseData.User.role as RoleEnum ).value,
                userImage: purchaseData.User.user_image
            }
        }
    }

    private toDomainPurchaseDetail( purchaseDetailData: PrismaPurchaseDetail & {Product?: PrismaProduct }): PurchaseDetailResponse {
        return {
            id: purchaseDetailData.purchase_detail_id,
            purchaseQuantity: purchaseDetailData.purchase_quantity,
            purchaseUnitPrice: new Money(parseFloat(`${purchaseDetailData.purchase_unit_price}`)).value,
            productId: purchaseDetailData.product_id,
            purchaseId: purchaseDetailData.purchase_id,
            Product: purchaseDetailData.Product && {
                productId: purchaseDetailData.Product.product_id,
                productImage: purchaseDetailData.Product.product_image,
                productName: purchaseDetailData.Product.product_name
            }
        }
    }

    private toPrisma( purchase: Purchase ): Omit<PrismaPurchase, 'purchase_id' | 'purchase_createdAt' | 'purchase_updatedAt'> {
        return {
            purchase_date: purchase.date,
            purchase_total: new Decimal(purchase.total.value),
            supplier_id: purchase.supplierId,
            user_id: purchase.userId
        }
    }

    private toPrismaPurchaseDetail( purchaseDetail: PurchaseDetail ): Omit<PrismaPurchaseDetail, 'purchase_detail_id'> {
        return {
            purchase_quantity: new Quantity( purchaseDetail.purchaseQuantity.value ).value,
            purchase_unit_price: new Decimal(purchaseDetail.purchaseUnitPrice.value),
            product_id: purchaseDetail.productId,
            purchase_id: purchaseDetail.purchaseId
        }
    }

    private buildWhereClause( baseWhere: any, filters: PurchaseFilters ) {
        const where = { ...baseWhere }

        if ( filters.prices ) {
            where.purchase_total = {
                gte: filters.prices.minPrice,
                lte: filters.prices.maxPrice
            }
        }

        if ( filters.dates ) {
            const adjustedDateTo = new Date( filters.dates.dateTo )
            adjustedDateTo.setHours(23, 59, 59, 999)

            where.purchase_date = {
                gte: filters.dates.dateFrom,
                lte: adjustedDateTo
            }
        }

        if ( filters.supplier ) {
            where.supplier_id = filters.supplier
        }

        if ( filters.user ) {
            where.user_id = filters.user
        }

        return where
    }

    async filterPurchases(filter: PurchaseFilters, pagination: PaginationDTO): Promise<PaginationResponseDto<PurchaseDetailsReponse>> {
        try {
            const { page, limit, orderBy, where, skip, take } = buildPaginationOptions(pagination)
            const filterWhere = this.buildWhereClause(where, filter)

            const [ purchases, total ] = await Promise.all([
                this.prisma.purchase.findMany({
                    where: filterWhere,
                    skip,
                    take,
                    orderBy,
                    include: {
                        User: true,
                        Supplier: true,
                        PurchaseDetails: {
                            include: {
                                Product: true
                            }
                        }
                    }
                }),
                this.prisma.purchase.count({ where: filterWhere })
            ])

            const totalPages = Math.ceil( total / limit )

            const purchasesWithDetails: PurchaseDetailsReponse[] = purchases.map( purchase => ({
                purchase: this.toDomain(purchase),
                details: purchase.PurchaseDetails.map( this.toDomainPurchaseDetail )      
            }))

            return {
                items: purchasesWithDetails,
                page,
                total,
                totalPages
            }

        } catch(error) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener las compras con filtro',
                'PRISMA_GET_PURCHASES_FILTER_ERROR'
            )
        }
    }

    async getPurchases(pagination: PaginationDTO): Promise<PaginationResponseDto<PurchaseDetailsReponse>> {
        try {

            const { limit, orderBy, page, skip, take, where } = buildPaginationOptions( pagination )

            const [ purchases, total ] = await Promise.all([
                this.prisma.purchase.findMany({
                    where,
                    skip,
                    take,
                    orderBy,
                    include: {
                        User: true,
                        Supplier: true,
                        PurchaseDetails: {
                            include: {
                                Product: true
                            }
                        }
                    }
                }),
                this.prisma.purchase.count({ where })
            ])

            const totalPages = Math.ceil( total / limit )

            const purchasesWithDetails: PurchaseDetailsReponse[] = purchases.map( purchase => ({
                purchase: this.toDomain(purchase),
                details: purchase.PurchaseDetails.map( this.toDomainPurchaseDetail )      
            }))

            return {
                items: purchasesWithDetails,
                page,
                total,
                totalPages
            }

        } catch( error ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener las compras',
                'PRISMA_GET_PURCHASES_ERROR'
            )
        }
    }

    async savePurchaseDetails(purchaseDetail: PurchaseDetail): Promise<PurchaseDetailResponse> {
        try {
            const detail = await this.prisma.purchase_Detail.create({
                data: this.toPrismaPurchaseDetail(purchaseDetail),
                include: { Product: true }
            })
            return this.toDomainPurchaseDetail(detail)
        } catch( error ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al guardar detalle de compra',
                'PRISMA_SAVE_PURCHASE_DETAIL_ERROR'
            )
        }
    }

    async savePurchase(purchase: Purchase): Promise<PurchaseResponse> {
        try {

            const purchaseSaved = await this.prisma.purchase.create({
                data: this.toPrisma(purchase),
                include: {
                    User: true,
                    Supplier: true
                }
            })
            
            return this.toDomain(purchaseSaved)
            
        } catch ( error ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al guardar la compra',
                'PRISMA_SAVE_PURCHASE_ERROR'
            )
        }
    }

}