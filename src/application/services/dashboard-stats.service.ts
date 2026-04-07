import { 
    GetDashboardKpisUseCase,

    GetProductsByCriticalStock,
    GetProductsByCategoryUseCase,
    GetInventoryAdjustmentSummaryUseCase,
    GetProductsMostAdjusted,

    GetProductsWithoutSalesUseCase, 
    GetSalesByCategoryUseCase, 
    GetSalesByDateUseCase, 
    GetSalesByUserUseCase, 
    GetSalesSummaryUseCase, 
    GetTopSellingProductsUseCase,
    
    GetPurchasesSummaryUseCase,
    GetPurchasesByDateUseCase,
    GetPurchasesBySupplierUseCase,
    GetTopPurchasedProductsUseCase,
    GetPurchasesByCategoryUseCase,
} from "../usecases/dashboard";

interface DashboardStatsServiceOptions {
    getDashboardKpisUC: GetDashboardKpisUseCase

    getProductsByCriticalStockUC: GetProductsByCriticalStock
    getProductsByCategoryUC: GetProductsByCategoryUseCase,
    getInventoryAdjustmentSummaryUC: GetInventoryAdjustmentSummaryUseCase
    getMostAdjustedProductsUC: GetProductsMostAdjusted

    getSalesByCategoryUC: GetSalesByCategoryUseCase,
    getSalesByDateUC: GetSalesByDateUseCase,
    getSalesByUserUC: GetSalesByUserUseCase,
    getProductsWithoutSalesUC: GetProductsWithoutSalesUseCase
    getSalesSummaryUC: GetSalesSummaryUseCase,
    getTopSellingProductsUC: GetTopSellingProductsUseCase,

    getPurchasesSummaryUC: GetPurchasesSummaryUseCase
    getPurchasesByDateUC: GetPurchasesByDateUseCase
    getPurchasesBySupplierUC: GetPurchasesBySupplierUseCase
    getPurchasesByCategoryUC: GetPurchasesByCategoryUseCase
    getTopPurchasedProductsUC: GetTopPurchasedProductsUseCase

}

export class DashboardStatsService {

    private readonly getDashboardKpisUC: GetDashboardKpisUseCase

    private readonly getProductsByCriticalStockUC: GetProductsByCriticalStock
    private readonly getProductsByCategoryUC: GetProductsByCategoryUseCase
    private readonly getInventoryAdjustmentSummaryUC: GetInventoryAdjustmentSummaryUseCase
    private readonly getMostAdjustedProductsUC: GetProductsMostAdjusted

    private readonly getSalesByCategoryUC: GetSalesByCategoryUseCase
    private readonly getSalesByDateUC: GetSalesByDateUseCase
    private readonly getSalesByUserUC: GetSalesByUserUseCase
    private readonly getProductsWithoutSalesUC: GetProductsWithoutSalesUseCase
    private readonly getSalesSummaryUC: GetSalesSummaryUseCase
    private readonly getTopSellingProductsUC: GetTopSellingProductsUseCase

    private readonly getPurchasesSummaryUC: GetPurchasesSummaryUseCase
    private readonly getPurchasesByDateUC: GetPurchasesByDateUseCase
    private readonly getPurchasesBySupplierUC: GetPurchasesBySupplierUseCase
    private readonly getPurchasesByCategoryUC: GetPurchasesByCategoryUseCase
    private readonly getTopPurchasedProductsUC: GetTopPurchasedProductsUseCase

    constructor({
        getDashboardKpisUC,

        getProductsByCriticalStockUC,
        getProductsByCategoryUC,
        getInventoryAdjustmentSummaryUC,
        getMostAdjustedProductsUC,

        getSalesByCategoryUC,
        getSalesByDateUC,
        getSalesByUserUC,
        getProductsWithoutSalesUC,
        getSalesSummaryUC,
        getTopSellingProductsUC,
        
        getPurchasesSummaryUC,
        getPurchasesByDateUC,
        getPurchasesBySupplierUC,
        getPurchasesByCategoryUC,
        getTopPurchasedProductsUC
    }: DashboardStatsServiceOptions){
        this.getDashboardKpisUC = getDashboardKpisUC

        this.getProductsByCriticalStockUC = getProductsByCriticalStockUC
        this.getProductsByCategoryUC = getProductsByCategoryUC
        this.getInventoryAdjustmentSummaryUC = getInventoryAdjustmentSummaryUC
        this.getMostAdjustedProductsUC = getMostAdjustedProductsUC

        this.getSalesByCategoryUC = getSalesByCategoryUC
        this.getSalesByDateUC = getSalesByDateUC
        this.getSalesByUserUC = getSalesByUserUC
        this.getProductsWithoutSalesUC = getProductsWithoutSalesUC
        this.getSalesSummaryUC = getSalesSummaryUC
        this.getTopSellingProductsUC = getTopSellingProductsUC
    
        this.getPurchasesSummaryUC = getPurchasesSummaryUC
        this.getPurchasesByDateUC = getPurchasesByDateUC
        this.getPurchasesBySupplierUC = getPurchasesBySupplierUC
        this.getPurchasesByCategoryUC = getPurchasesByCategoryUC
        this.getTopPurchasedProductsUC = getTopPurchasedProductsUC
    }

    public async getKpisStats() {
        return await this.getDashboardKpisUC.execute()
    }

    public async getSalesStats() {
        const salesByCategory = await this.getSalesByCategoryUC.execute()
        const salesByDate = await this.getSalesByDateUC.execute()
        const salesByUser = await this.getSalesByUserUC.execute()
        const productsWithoutSales = await this.getProductsWithoutSalesUC.execute()
        const salesSummary = await this.getSalesSummaryUC.execute()
        const getTopSellingProducts = await this.getTopSellingProductsUC.execute()
        
        return {
            salesByCategory,
            salesByDate,
            salesByUser,
            productsWithoutSales,
            salesSummary,
            getTopSellingProducts,
        }
    }

    public async getPurchasesStats() {
        const purchaseSummary = await this.getPurchasesSummaryUC.execute()
        const purchasesByDate = await this.getPurchasesByDateUC.execute()
        const purchasesBySupplier = await this.getPurchasesBySupplierUC.execute()
        const purchasesByCategory = await this.getPurchasesByCategoryUC.execute()
        const topPurchasedProducts = await this.getTopPurchasedProductsUC.execute()

        return {
            purchaseSummary,
            purchasesByDate,
            purchasesBySupplier,
            purchasesByCategory,
            topPurchasedProducts
        }
    }

    public async getProductsStats() {
        const productsCritialStock = await this.getProductsByCriticalStockUC.execute()
        const productsByCategory = await this.getProductsByCategoryUC.execute()
        const inventoryAdjustmentSummary = await this.getInventoryAdjustmentSummaryUC.execute()
        const productsMostAdjusted = await this.getMostAdjustedProductsUC.execute()

        return {
            productsCritialStock,
            productsByCategory,
            inventoryAdjustmentSummary,
            productsMostAdjusted
        }
    }

    public async getAllStats() {
        const kpiStats = await this.getKpisStats()
        const salesStats = await this.getSalesStats()
        const purchasesStats = await this.getPurchasesStats()
        const productsStats = await this.getProductsStats()

        return {
            kpiStats,
            salesStats,
            purchasesStats,
            productsStats
        }
    }

}