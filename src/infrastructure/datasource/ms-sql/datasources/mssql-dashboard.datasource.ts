import { ConnectionPool } from "mssql";
import { DashboardKpis, ChartPoint, TopProductStats, ProductWithoutSales, SalesByUserStats, CriticalStockProduct, ProductsByCategory, PurchasesBySupplier, PurchaseSummary, SalesByCategory, SalesSummary, InventoryAdjustmentSummary, MostAdjustedProduct, TopPurchasedProduct, PurchasesByCategory } from "../../../../application/dtos/dashboard-stats.dto";
import { DashboardStatsDatasource } from "../../../../domain/datasources";
import { InfrastructureError } from "../../../errors/infrastructure-error";

export class MSSQLStatsDashboard implements DashboardStatsDatasource {

    constructor(private readonly pool: ConnectionPool) { }

    async getKpis(): Promise<DashboardKpis> {
        try {
            const result = await this.pool.request().query(`
                SELECT
                    (SELECT ISNULL(SUM(sale_total), 0) FROM Sale) AS totalSales,
                    (SELECT ISNULL(SUM(purchase_total), 0) FROM Purchase) AS totalPurchases,
                    (SELECT ISNULL(SUM(sale_total), 0) FROM Sale) - (SELECT ISNULL(SUM(purchase_total), 0) FROM Purchase ) AS netProfit,
                    (SELECT COUNT(*) FROM Product WHERE product_stock <= product_stock_min) AS criticalStockProducts,
                    (SELECT COUNT(*) FROM Product WHERE product_is_active = 1) AS totalActiveProducts,
                    (SELECT ISNULL(SUM(product_stock * product_selling_price), 0) FROM Product WHERE product_is_active = 1) AS totalStockValue,
                    (SELECT COUNT(*) FROM [User] WHERE user_is_active = 1) AS totalActiveUsers
            `)

            const row = result.recordset[0]

            return {
                totalSales: Number(row.totalSales),
                totalPurchases: Number(row.totalPurchases),
                netProfit: Number(row.netProfit),
                criticalStockProducts: Number(row.criticalStockProducts),
                totalActiveProducts: Number(row.totalActiveProducts),
                totalStockValue: Number(row.totalStockValue),
                totalActiveUsers: Number(row.totalActiveUsers)
            }
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo KPIs',
                'MSSQL_DASHBOARD_KPI_ERROR',
                error
            )
        }
    }

    async getSalesSummary(): Promise<SalesSummary> {
        try {
            const result = await this.pool.request().query(`
                SELECT 
                    COUNT(*) AS totalOrders,
                    ISNULL(AVG(sale_total), 0) AS averageOrderValue,
                    ISNULL(MAX(sale_total), 0) AS maxOrderValue,
                    ISNULL(MIN(sale_total), 0) AS minOrderValue
                FROM Sale
            `)

            const row = result.recordset[0]

            return {
                totalOrders: Number(row.totalOrders),
                averageOrderValue: Number(row.averageOrderValue),
                maxOrderValue: Number(row.maxOrderValue),
                minOrderValue: Number(row.minOrderValue),
            }

        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo resumen de ventas',
                'MSSQL_DASHBOARD_SALES_SUMMARY_ERROR',
                error
            )
        }
    }

    async getSalesByDate(): Promise<ChartPoint[]> {
        try {
            const result = await this.pool.request().query(`
                SELECT
                    CONVERT(VARCHAR(10), sale_date, 120) AS date,
                    SUM(sale_total) AS total
                FROM Sale
                GROUP BY CONVERT(VARCHAR(10), sale_date, 120)
                ORDER BY date ASC
            `)

            return result.recordset.map(r => ({
                date: r.date,
                total: Number(r.total)
            }))

        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo ventas por fecha',
                'MSSQL_DASHBOARD_SALES_BY_DATE_ERROR',
                error
            )
        }
    }

    async getSalesByCategory(): Promise<SalesByCategory[]> {
        try {
            const result = await this.pool.request().query(`
                WITH CategorySales AS (
                    SELECT 
                        c.category_id,
                        c.category_name,
                        c.category_icon,
                        SUM( spd.sale_product_detail_quantity * spd.sale_product_detail_unit_price - ISNULL(spd.sale_product_detail_quantity, 0) ) AS totalSales,
                        SUM( spd.sale_product_detail_quantity ) AS quantitySold
                    FROM Sale_Product_Detail spd
                    INNER JOIN Product p ON p.product_id = spd.product_id
                    INNER JOIN Category c ON c.category_id = p.category_id
                    GROUP BY c.category_id, c.category_name, c.category_icon
                )
                SELECT 
                    category_id,
                    category_name,
                    category_icon,
                    totalSales,
                    quantitySold,
                    ROUND( totalSales * 100.0 / NULLIF(SUM(totalSales) OVER(), 0), 2) AS percentage
                FROM CategorySales
                ORDER BY totalSales DESC
            `)

            return result.recordset.map(r => ({
                categoryId: r.category_id,
                categoryName: r.category_name,
                categoryIcon: r.category_icon,
                totalSales: Number(r.totalSales),
                quantitySold: Number(r.quantitySold),
                percetage: Number(r.percentage)
            }))

        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo ventas por categoría',
                'MSSQL_DASHBOARD_SALES_BY_CATEGORY_ERROR',
                error
            )
        }
    }

    async getSalesByUser(): Promise<SalesByUserStats[]> {
        try {
            const result = await this.pool.request().query(`
                WITH UserSales AS (
                    SELECT 
                        s.user_id,
                        u.user_name,
                        u.user_lastname,
                        u.user_image,
                        u.role,
                        SUM(s.sale_total) AS totalSales,
                        COUNT(s.sale_id) AS ordersCount,
                        AVG(s.sale_total) AS averageOrderValue
                    FROM Sale s
                    INNER JOIN [User] u ON u.user_id = s.user_id
                    GROUP BY s.user_id, u.user_name, u.user_lastname, u.user_image, u.role
                )
                SELECT 
                    user_id,
                    user_name,
                    user_lastname,
                    user_image,
                    role,
                    totalSales,
                    ordersCount,
                    averageOrderValue,
                    ROUND( 
                        totalSales * 100.0 / NULLIF(SUM(totalSales) OVER (), 0), 
                        2
                    ) AS percentage
                FROM UserSales
                ORDER BY totalSales DESC
            `)

            if (!result.recordset.length) return []

            return result.recordset.map(r => ({
                userId: r.user_id,
                userName: `${r.user_name ?? ''} ${r.user_lastname ?? ''}`.trim(),
                userImage: r.user_image,
                role: r.role,
                totalSales: Number(r.totalSales),
                ordersCount: Number(r.ordersCount),
                averageOrderValue: Number(r.averageOrderValue),
                percentage: Number(r.percentage)
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo ventas por usuario',
                'MSSQL_DASHBOARD_SALES_BY_USER_ERROR',
                error
            )
        }
    }

    async getTopSellingProducts(): Promise<TopProductStats[]> {
        try {
            const result = await this.pool.request()
                .query(`
                    SELECT TOP 5
                        spd.product_id,
                        p.product_name,
                        SUM(spd.sale_product_detail_quantity) AS quantitySold,
                        SUM(
                            spd.sale_product_detail_quantity * spd.sale_product_detail_unit_price
                            - ISNULL(spd.sale_product_detail_discount, 0)
                        ) AS totalGenerated
                    FROM Sale_Product_Detail spd
                        INNER JOIN Product p ON p.product_id = spd.product_id
                    GROUP BY spd.product_id, p.product_name
                    ORDER BY quantitySold DESC
                `)

            return result.recordset.map(r => ({
                productId: r.product_id,
                productName: r.product_name,
                quantitySold: Number(r.quantitySold),
                totalGenerated: Number(r.totalGenerated)
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo productos más vendidos',
                'MSSQL_DASHBOARD_TOP_PRODUCTS_ERROR',
                error
            )
        }
    }

    async getProductsWithoutSales(): Promise<ProductWithoutSales[]> {
        try {
            const result = await this.pool.request().query(`
                SELECT p.product_id, p.product_name, p.product_stock
                FROM Product p
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM Sale_Product_Detail spd
                    WHERE spd.product_id = p.product_id
                )
            `)

            return result.recordset.map(r => ({
                productId: r.product_id,
                productName: r.product_name,
                stock: r.product_stock
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo productos sin ventas',
                'MSSQL_DASHBOARD_TOP_PRODUCTS_ERROR',
                error
            )
        }
    }

    async getPurchaseSummary(): Promise<PurchaseSummary> {
        try {
            const result = await this.pool.request().query(`
                SELECT
                    COUNT(*)                        AS totalOrders,
                    ISNULL(AVG(purchase_total), 0)  AS averageOrderValue,
                    ISNULL(MAX(purchase_total), 0)  AS maxOrderValue,
                    ISNULL(MIN(purchase_total), 0)  AS minOrderValue
                FROM Purchase
            `)

            const row = result.recordset[0]
            return {
                totalOrders: Number(row.totalOrders),
                averageOrderValue: Number(row.averageOrderValue),
                maxOrderValue: Number(row.maxOrderValue),
                minOrderValue: Number(row.minOrderValue)
            }
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo resumen de compras',
                'MSSQL_DASHBOARD_PURCHASES_SUMMARY_ERROR',
                error
            )
        }
    }

    async getPurchasesByDate(): Promise<ChartPoint[]> {
        try {
            const result = await this.pool.request().query(`
                SELECT
                    CONVERT(VARCHAR(10), purchase_date, 120) AS date,
                    SUM(purchase_total) AS total
                FROM Purchase
                GROUP BY CONVERT(VARCHAR(10), purchase_date, 120)
                ORDER BY date ASC
            `)

            return result.recordset.map(r => ({
                date: r.date,
                total: Number(r.total)
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo compras por fecha',
                'MSSQL_DASHBOARD_PURCHASES_BY_DATE_ERROR',
                error
            )
        }
    }

    async getPurchasesBySupplier(): Promise<PurchasesBySupplier[]> {
        try {
            const result = await this.pool.request().query(`
                WITH SupplierPurchases AS (
                    SELECT
                        p.supplier_id,
                        s.supplier_name,
                        s.supplier_lastname,
                        s.supplier_company,
                        SUM(p.purchase_total)   AS totalPurchases,
                        COUNT(p.purchase_id)    AS ordersCount
                    FROM Purchase p
                    INNER JOIN Supplier s ON s.supplier_id = p.supplier_id
                    GROUP BY p.supplier_id, s.supplier_company, s.supplier_name, s.supplier_lastname
                )
                SELECT
                    supplier_id,
                    supplier_company,
                    supplier_name,
                    supplier_lastname,
                    totalPurchases,
                    ordersCount,
                    ROUND(
                        totalPurchases * 100.0 / NULLIF(SUM(totalPurchases) OVER (), 0),
                        2
                    ) AS percentage
                FROM SupplierPurchases
                ORDER BY totalPurchases DESC
            `)

            return result.recordset.map(r => ({
                supplierId: r.supplier_id,
                supplierName: r.supplier_name,
                supplierLastname: r.supplier_lastname,
                supplierCompany: r.supplier_company,
                totalPurchases: Number(r.totalPurchases),
                ordersCount: Number(r.ordersCount),
                percentage: Number(r.percentage)
            }))

        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo compras por proveedor',
                'MSSQL_DASHBOARD_PURCHASES_BY_SUPPLIER_ERROR',
                error
            )
        }
    }

    async getTopPurchasedProducts(): Promise<TopPurchasedProduct[]> {
        try {
            const result = await this.pool.request()
                .query(`
                    SELECT TOP 5
                        pd.product_id,
                        pr.product_name,
                        SUM(pd.purchase_quantity)                       AS totalQuantity,
                        SUM(pd.purchase_quantity * pd.purchase_unit_price) AS totalSpent,
                        AVG(pd.purchase_unit_price)                     AS avgUnitPrice
                    FROM Purchase_Detail pd
                    INNER JOIN Product pr ON pr.product_id = pd.product_id
                    GROUP BY pd.product_id, pr.product_name
                    ORDER BY totalSpent DESC
                `)

            return result.recordset.map(r => ({
                productId: r.product_id,
                productName: r.product_name,
                totalQuantity: Number(r.totalQuantity),
                totalSpent: Number(r.totalSpent),
                avgUnitPrice: Number(r.avgUnitPrice)
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo productos más comprados',
                'MSSQL_DASHBOARD_TOP_PURCHASED_PRODUCTS_ERROR',
                error
            )
        }
    }

    async getPurchasesByCategory(): Promise<PurchasesByCategory[]> {
        try {
            const result = await this.pool.request().query(`
                WITH CategorySpend AS (
                    SELECT
                        c.category_id,
                        c.category_name,
                        c.category_icon,
                        SUM(pd.purchase_quantity)                           AS totalQuantity,
                        SUM(pd.purchase_quantity * pd.purchase_unit_price)  AS totalSpent
                    FROM Purchase_Detail pd
                    INNER JOIN Product pr  ON pr.product_id   = pd.product_id
                    INNER JOIN Category c  ON c.category_id   = pr.category_id
                    GROUP BY c.category_id, c.category_name, c.category_icon
                )
                SELECT
                    category_id,
                    category_name,
                    category_icon,
                    totalQuantity,
                    totalSpent,
                    ROUND(
                        totalSpent * 100.0 / NULLIF(SUM(totalSpent) OVER (), 0),
                        2
                    ) AS percentage
                FROM CategorySpend
                ORDER BY totalSpent DESC
            `)

            return result.recordset.map(r => ({
                categoryId: r.category_id,
                categoryName: r.category_name,
                categoryIcon: r.category_icon,
                totalQuantity: Number(r.totalQuantity),
                totalSpent: Number(r.totalSpent),
                percentage: Number(r.percentage)
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo compras por categoría',
                'MSSQL_DASHBOARD_PURCHASES_BY_CATEGORY_ERROR',
                error
            )
        }
    }

    async getCriticalStockProducts(): Promise<CriticalStockProduct[]> {
        try {
            const result = await this.pool.request().query(`
                SELECT
                    product_id,
                    product_name,
                    product_stock                                       AS stock,
                    product_stock_min                                   AS stockMin,
                    product_stock * product_selling_price               AS stockValue
                FROM Product
                WHERE product_stock <= product_stock_min
                ORDER BY product_stock ASC
            `)

            return result.recordset.map(r => ({
                productId: r.product_id,
                productName: r.product_name,
                stock: Number(r.stock),
                stockMin: Number(r.stockMin),
                stockValue: Number(r.stockValue)
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo productos con stock crítico',
                'MSSQL_DASHBOARD_CRITICAL_STOCK_ERROR',
                error
            )
        }
    }

    async getProductsByCategory(): Promise<ProductsByCategory[]> {
        try {
            const result = await this.pool.request().query(`
                SELECT
                    c.category_id,
                    c.category_name,
                    c.category_icon,
                    COUNT(p.product_id)                                         AS productCount,
                    SUM(
                        CASE 
                            WHEN p.product_is_active = 1 THEN 1 
                            ELSE 0 
                        END
                    )   AS activeProductCount
                FROM Category c
                LEFT JOIN Product p ON p.category_id = c.category_id
                GROUP BY c.category_id, c.category_name, c.category_icon
                ORDER BY productCount DESC
            `)

            return result.recordset.map(r => ({
                categoryId: r.category_id,
                categoryName: r.category_name,
                categoryIcon: r.category_icon,
                productCount: Number(r.productCount),
                activeProductCount: Number(r.activeProductCount)
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo productos por categoría',
                'MSSQL_DASHBOARD_PRODUCTS_BY_CATEGORY_ERROR',
                error
            )
        }
    }

    async getInventoryAdjustmentSummary(): Promise<InventoryAdjustmentSummary> {
        try {
            const result = await this.pool.request().query(`
                SELECT
                    COUNT(*)                                                                AS totalAdjustments,
                    SUM(CASE WHEN adjustment_type = 'entrada' THEN 1 ELSE 0 END)           AS totalEntradas,
                    SUM(CASE WHEN adjustment_type = 'salida'  THEN 1 ELSE 0 END)           AS totalSalidas,
                    ISNULL(SUM(CASE WHEN adjustment_type = 'entrada'
                        THEN adjustment_quantity ELSE 0 END), 0)                           AS totalUnitsAdded,
                    ISNULL(SUM(CASE WHEN adjustment_type = 'salida'
                        THEN adjustment_quantity ELSE 0 END), 0)                           AS totalUnitsRemoved
                FROM Inventory_Adjustment
            `)

            const row = result.recordset[0]
            return {
                totalAdjustments: Number(row.totalAdjustments),
                totalEntradas: Number(row.totalEntradas),
                totalSalidas: Number(row.totalSalidas),
                totalUnitsAdded: Number(row.totalUnitsAdded),
                totalUnitsRemoved: Number(row.totalUnitsRemoved)
            }
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo resumen de ajustes de inventario',
                'MSSQL_DASHBOARD_PRODUCTS_BY_CATEGORY_ERROR',
                error
            )
        }
    }

    async getMostAdjustedProducts(): Promise<MostAdjustedProduct[]> {
        try {
            const result = await this.pool.request()
                .query(`
                    SELECT TOP 5
                        ia.product_id,
                        p.product_name,
                        COUNT(ia.adjustment_id) AS adjustmentCount,
                        ISNULL(
                            SUM(
                                CASE 
                                    WHEN ia.adjustment_type = 'entrada'THEN ia.adjustment_quantity 
                                    ELSE 0 
                                END
                            ), 
                            0
                        ) AS totalUnitsAdded,
                        ISNULL(
                            SUM(
                                CASE 
                                    WHEN ia.adjustment_type = 'salida' THEN ia.adjustment_quantity 
                                    ELSE 0 
                                END
                            ), 
                            0
                        ) AS totalUnitsRemoved
                    FROM Inventory_Adjustment ia
                    INNER JOIN Product p ON p.product_id = ia.product_id
                    GROUP BY ia.product_id, p.product_name
                    ORDER BY adjustmentCount DESC
                `)

            return result.recordset.map(r => ({
                productId: r.product_id,
                productName: r.product_name,
                adjustmentCount: Number(r.adjustmentCount),
                totalUnitsAdded: Number(r.totalUnitsAdded),
                totalUnitsRemoved: Number(r.totalUnitsRemoved)
            }))
        } catch (error) {
            throw new InfrastructureError(
                'Error obteniendo productos más ajustados',
                'MSSQL_DASHBOARD_MOST_ADJUSTED_PRODUCTS_ERROR',
                error
            )
        }

    }


}