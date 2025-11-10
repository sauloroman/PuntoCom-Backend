import { PrismaClient, User as PrismaUser, Product as PrismaProduct, Inventory_Adjustment as PrismaInventoryAdjustment } from "../../../../generated/prisma";
import { InventoryAdjustmentResponse } from "../../../application/dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { DatesAdapter } from "../../../config/plugins";
import { InventoryAdjustmentDatasource } from "../../../domain/datasources/inventory-adjustment.datasource";
import { InventoryAdjustment } from "../../../domain/entities";
import { AdjustmentEnum } from "../../../domain/value-objects/Adjustment";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { buildPaginationOptions } from "./utils/pagination-options";

export class PrismaInventoryAdjustmentDatasource implements InventoryAdjustmentDatasource {
    
    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient){
        this.prisma = prisma
    }

    async getAllInventoryAdjustments(): Promise<InventoryAdjustmentResponse[]> {
        try {
            const adjustments = await this.prisma.inventory_Adjustment.findMany()
            return adjustments.map( this.toDomain )
        } catch(error) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener todos los ajustes de inventario',
                'PRISMA_GET_INVENTORY_ADJUSTMENTS_ERROR'
            )
        }
    }

    async listInventoryAdjustments(pagination: PaginationDTO): Promise<PaginationResponseDto<InventoryAdjustmentResponse>> {
        try {

            const { page, limit, orderBy, skip, take, where } = buildPaginationOptions(pagination)

            const [ adjustments, total ] = await Promise.all([
                this.prisma.inventory_Adjustment.findMany({
                    where,
                    skip,
                    take,
                    orderBy,
                    include: {
                        User: true,
                        Product: true
                    }
                }),
                this.prisma.inventory_Adjustment.count({ where })
            ])

            const totalPages = Math.ceil( total / limit )

            return {
                items: adjustments.map( this.toDomain ),
                total,
                page,
                totalPages
            }

        } catch( error ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al obtener los ajustes de inventario',
                'PRISMA_GET_INVENTORY_ADJUSTMENTS_ERROR'
            )
        }
    }

    async save(inventoryAdjustment: InventoryAdjustment): Promise<InventoryAdjustmentResponse> {
        try {
            const adjustment = await this.prisma.inventory_Adjustment.create({ 
                data: this.toPrisma(inventoryAdjustment), 
                include: { Product: true, User: true }}
            )

            return this.toDomain( adjustment )
        } catch( error ) {
            throw new InfrastructureError(
                '[PRISMA]: Error al guardar el ajuste de inventario',
                'PRISMA_SAVE_INVENTORY_ADJUSTMENT_ERROR'
            )
        }
    }

    private toDomain( inventoryAdjustmentData: PrismaInventoryAdjustment & { User?: PrismaUser, Product?: PrismaProduct }): InventoryAdjustmentResponse {
        return {
            adjustmentId: inventoryAdjustmentData.adjustment_id,
            adjustmentPrevQuantity: inventoryAdjustmentData.adjustment_prev_quantity,
            adjustmentQuantity: inventoryAdjustmentData.adjustment_quantity,
            adjustmentReason: inventoryAdjustmentData.adjustment_reason,
            productId: inventoryAdjustmentData.product_id,
            userId: inventoryAdjustmentData.user_id,
            adjustmentType: inventoryAdjustmentData.adjustment_type as AdjustmentEnum,
            adjustmentDate: DatesAdapter.formatLocal( inventoryAdjustmentData.adjustment_date ),
            Product: inventoryAdjustmentData.Product && {
                id: inventoryAdjustmentData.Product.product_id,
                code: inventoryAdjustmentData.Product.product_code,
                image: inventoryAdjustmentData.Product.product_image,
                imageCode: inventoryAdjustmentData.Product.product_image_code,
                isActive: inventoryAdjustmentData.Product.product_is_active,
                name: inventoryAdjustmentData.Product.product_name
            },
            User: inventoryAdjustmentData.User && {
                id: inventoryAdjustmentData.User.user_id,
                name: `${inventoryAdjustmentData.User.user_name} ${inventoryAdjustmentData.User.user_lastname}`,
                image: inventoryAdjustmentData.User.user_image,
                role: inventoryAdjustmentData.User.role
            }
        }
    }

    private toPrisma( inventoryAdjustment: InventoryAdjustment ): Omit<PrismaInventoryAdjustment, 'adjustment_id'> {
        return {
            product_id: inventoryAdjustment.productId,
            user_id: inventoryAdjustment.userId,
            adjustment_type: inventoryAdjustment.adjustmentType.value,
            adjustment_prev_quantity: inventoryAdjustment.adjustmentPrevQuantity.value,
            adjustment_quantity: inventoryAdjustment.adjustmentQuantity.value,
            adjustment_reason: inventoryAdjustment.adjustmentReason,
            adjustment_date: inventoryAdjustment.adjustmentDate,
        }
    }
}