import { PrismaClient } from "../../../../generated/prisma";
import { 
    DashboardKpis,
    ChartPoint,
    TopProductStats,
    ProductWithoutSales,
    SalesByUserStats,
    CriticalStockProduct,
    ProductsByCategory,
    PurchasesBySupplier,
    PurchaseSummary,
    SalesByCategory,
    SalesSummary
} from "../../../application/dtos/dashboard-stats.dto";
import { DashboardStatsDatasource } from "../../../domain/datasources/dashboard-stats.datasource";

export class PrismaDashboardStatsDatasource implements DashboardStatsDatasource {

    constructor(private readonly prisma: PrismaClient){}

    getKpis(): Promise<DashboardKpis> {
        throw new Error("Method not implemented.");
    }
    getSalesSummary(): Promise<SalesSummary> {
        throw new Error("Method not implemented.");
    }
    getSalesByDate(): Promise<ChartPoint[]> {
        throw new Error("Method not implemented.");
    }
    getSalesByCategory(): Promise<SalesByCategory[]> {
        throw new Error("Method not implemented.");
    }
    getSalesByUser(): Promise<SalesByUserStats[]> {
        throw new Error("Method not implemented.");
    }
    getTopSellingProducts(): Promise<TopProductStats[]> {
        throw new Error("Method not implemented.");
    }
    getProductsWithoutSales(): Promise<ProductWithoutSales[]> {
        throw new Error("Method not implemented.");
    }
    getPurchaseSummary(): Promise<PurchaseSummary> {
        throw new Error("Method not implemented.");
    }
    getPurchasesByDate(): Promise<ChartPoint[]> {
        throw new Error("Method not implemented.");
    }
    getPurchasesBySupplier(): Promise<PurchasesBySupplier[]> {
        throw new Error("Method not implemented.");
    }
    getCriticalStockProducts(): Promise<CriticalStockProduct[]> {
        throw new Error("Method not implemented.");
    }
    getProductsByCategory(): Promise<ProductsByCategory[]> {
        throw new Error("Method not implemented.");
    }

}
