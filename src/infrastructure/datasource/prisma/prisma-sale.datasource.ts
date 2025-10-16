import { PrismaClient, Sale as PrismaSale, User as PrismaUser, Sale_Product_Detail as PrismaSaleDetail } from "../../../../generated/prisma";
import { Decimal } from "../../../../generated/prisma/runtime/library";
import { SaleDetail, SaleProductDetailResponse, SaleResponse } from "../../../application/dtos/sale.dto";
import { SalesDatasource } from "../../../domain/datasources/sales.datasource";
import { Sale, SaleProductDetail } from "../../../domain/entities";
import { Money, Quantity } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";

export class PrismaSalesDatasource implements SalesDatasource {
    
    private readonly prisma: PrismaClient

    constructor( prisma: PrismaClient ) {
        this.prisma = prisma
    }

    async saveSaleDetails(data: SaleProductDetail): Promise<SaleProductDetailResponse> {
        try {
            const detail = await this.prisma.sale_Product_Detail.create({
                data: this.toPrismaSaleDetail( data )
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

    private toDomainSaleDetail( saleDetailData: PrismaSaleDetail ): SaleProductDetailResponse {
        return {
            id: saleDetailData.sale_product_detail_id,
            saleQuantity: saleDetailData.sale_product_detail_quantity,
            saleUnitPrice: new Money(parseFloat(`${saleDetailData.sale_product_detail_unit_price}`)).value,
            saleDiscount: new Money(parseFloat(`${saleDetailData.sale_product_discount}`)).value,
            productId: saleDetailData.product_id,
            saleId: saleDetailData.sale_id
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

}