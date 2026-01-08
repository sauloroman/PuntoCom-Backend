import { PrismaClient } from "../../../../generated/prisma";
import { 
    DashboardKpis,
    ChartPoint,
    TopProductStats,
    ProductWithoutSales
} from "../../../application/dtos/dashboard-stats.dto";
import { DashboardStatsDatasource } from "../../../domain/datasources/dashboard-stats.datasource";
import { InfrastructureError } from "../../errors/infrastructure-error";

export class PrismaDashboardStatsDatasource implements DashboardStatsDatasource {

    constructor(private readonly prisma: PrismaClient){}

    public async getKpis(): Promise<DashboardKpis> {
        try {
            const [ sales, purchases, criticalStock ] = await Promise.all([
                this.prisma.sale.aggregate({ _sum: { sale_total: true }}),
                this.prisma.purchase.aggregate({ _sum: { purchase_total: true }}),
                this.prisma.product.count({
                    where: {
                        product_stock: {
                            lte: this.prisma.product.fields.product_stock_min
                        }
                    }
                })
            ])

            return {
                totalSales: Number(sales._sum.sale_total ?? 0),
                totalPurchases: Number(purchases._sum.purchase_total ?? 0),
                criticalStockProducts: criticalStock
            }

        } catch (error) {
            throw new InfrastructureError(
                '[PRISMA]: Error obteniendo KPIs',
                'PRISMA_DASHBOARD_KPI_ERROR',
                error
            )
        }
    }

    public async getSalesByDate(): Promise<ChartPoint[]> {
        try {
            const result = await this.prisma.sale.groupBy({
                by: ['sale_date'],
                _sum: { sale_total: true },
                orderBy: { sale_date: 'asc' }
            })

            return result.map(r => ({
                date: r.sale_date.toISOString().split('T')[0],
                total: Number(r._sum.sale_total ?? 0)
            }))
        } catch (error) {
            throw new InfrastructureError(
                '[PRISMA]: Error obteniendo ventas por fecha',
                'PRISMA_DASHBOARD_SALES_BY_DATE_ERROR',
                error
            )
        }
    }

    public async getPurchasesByDate(): Promise<ChartPoint[]> {
        try {
            const result = await this.prisma.purchase.groupBy({
                by: ['purchase_date'],
                _sum: { purchase_total: true },
                orderBy: { purchase_date: 'asc' }
            })

            return result.map(r => ({
                date: r.purchase_date.toISOString().split('T')[0],
                total: Number(r._sum.purchase_total ?? 0)
            }))
        } catch (error) {
            throw new InfrastructureError(
                '[PRISMA]: Error obteniendo compras por fecha',
                'PRISMA_DASHBOARD_PURCHASES_BY_DATE_ERROR',
                error
            )
        }
    }

    public async getTopSellingProduct(): Promise<TopProductStats | null> {
        try {
            const result = await this.prisma.sale_Product_Detail.groupBy({
                by: ['product_id'],
                _sum: {
                    sale_product_detail_quantity: true,
                    sale_product_detail_unit_price: true
                },
                orderBy: {
                    _sum: { sale_product_detail_quantity: 'desc' }
                },
                take: 1
            })

            if (!result.length) return null

            const product = await this.prisma.product.findUnique({
                where: { product_id: result[0].product_id }
            })

            return {
                productId: result[0].product_id,
                productName: product?.product_name ?? 'Desconocido',
                quantitySold: Number(result[0]._sum.sale_product_detail_quantity ?? 0),
                totalGenerated: Number(result[0]._sum.sale_product_detail_unit_price ?? 0)
            }

        } catch (error) {
            throw new InfrastructureError(
                '[PRISMA]: Error obteniendo el producto más vendido',
                'PRISMA_DASHBOARD_TOP_SELLING_PRODUCT_ERROR',
                error
            )
        }
    }

    public async getProductsWithoutSales(): Promise<ProductWithoutSales[]> {
        try {
            const products = await this.prisma.product.findMany({
                where: {
                    SaleProductDetails: { none: {} }
                }
            })

            return products.map(p => ({
                productId: p.product_id,
                productName: p.product_name,
                stock: p.product_stock
            }))

        } catch (error) {
            throw new InfrastructureError(
                '[PRISMA]: Error obteniendo productos sin ventas',
                'PRISMA_DASHBOARD_PRODUCTS_WITHOUT_SALES_ERROR',
                error
            )
        }
    }
}
