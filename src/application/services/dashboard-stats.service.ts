import { 
    GetDashboardKpisUseCase,

    GetProductsByCriticalStock,

    GetProductsWithoutSalesUseCase, 
    GetSalesByCategoryUseCase, 
    GetSalesByDateUseCase, 
    GetSalesByUserUseCase, 
    GetSalesSummaryUseCase, 
    GetTopSellingProductsUseCase,
    
    GetPurchasesSummaryUseCase,
    GetPurchasesByDateUseCase,
    GetPurchasesBySupplierUseCase
} from "../usecases/dashboard";

interface DashboardStatsServiceOptions {
    getDashboardKpisUC: GetDashboardKpisUseCase

    getProductsByCriticalStockUC: GetProductsByCriticalStock

    getSalesByCategoryUC: GetSalesByCategoryUseCase,
    getSalesByDateUC: GetSalesByDateUseCase,
    getSalesByUserUC: GetSalesByUserUseCase,
    getProductsWithoutSalesUC: GetProductsWithoutSalesUseCase
    getSalesSummaryUC: GetSalesSummaryUseCase,
    getTopSellingProductsUC: GetTopSellingProductsUseCase,

    getPurchasesSummaryUC: GetPurchasesSummaryUseCase
    getPurchasesByDateUC: GetPurchasesByDateUseCase
    getPurchasesBySupplierUC: GetPurchasesBySupplierUseCase

}

export class DashboardStatsService {

    private readonly getDashboardKpisUC: GetDashboardKpisUseCase

    private readonly getProductsByCriticalStockUC: GetProductsByCriticalStock

    private readonly getSalesByCategoryUC: GetSalesByCategoryUseCase
    private readonly getSalesByDateUC: GetSalesByDateUseCase
    private readonly getSalesByUserUC: GetSalesByUserUseCase
    private readonly getProductsWithoutSalesUC: GetProductsWithoutSalesUseCase
    private readonly getSalesSummaryUC: GetSalesSummaryUseCase
    private readonly getTopSellingProductsUC: GetTopSellingProductsUseCase

    private readonly getPurchasesSummaryUC: GetPurchasesSummaryUseCase
    private readonly getPurchasesByDateUC: GetPurchasesByDateUseCase
    private readonly getPurchasesBySupplierUC: GetPurchasesBySupplierUseCase

    constructor({
        getDashboardKpisUC,
        getProductsByCriticalStockUC,
        getSalesByCategoryUC,
        getSalesByDateUC,
        getSalesByUserUC,
        getProductsWithoutSalesUC,
        getSalesSummaryUC,
        getTopSellingProductsUC,
        getPurchasesSummaryUC,
        getPurchasesByDateUC,
        getPurchasesBySupplierUC
    }: DashboardStatsServiceOptions){
        this.getDashboardKpisUC = getDashboardKpisUC

        this.getProductsByCriticalStockUC = getProductsByCriticalStockUC

        this.getSalesByCategoryUC = getSalesByCategoryUC
        this.getSalesByDateUC = getSalesByDateUC
        this.getSalesByUserUC = getSalesByUserUC
        this.getProductsWithoutSalesUC = getProductsWithoutSalesUC
        this.getSalesSummaryUC = getSalesSummaryUC
        this.getTopSellingProductsUC = getTopSellingProductsUC
    
        this.getPurchasesSummaryUC = getPurchasesSummaryUC
        this.getPurchasesByDateUC = getPurchasesByDateUC
        this.getPurchasesBySupplierUC = getPurchasesBySupplierUC
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
        const getTopSellingProductsUC = await this.getTopSellingProductsUC.execute()
        
        return {
            salesByCategory,
            salesByDate,
            salesByUser,
            productsWithoutSales,
            salesSummary,
            getTopSellingProductsUC,
        }
    }

    public async getPurchasesStats() {
        const getPurchaseSummary = await this.getPurchasesSummaryUC.execute()
        const getPurchasesByDate = await this.getPurchasesByDateUC.execute()
        const getPurchasesBySupplier = await this.getPurchasesBySupplierUC.execute()

        return {
            getPurchaseSummary,
            getPurchasesByDate,
            getPurchasesBySupplier
        }
    }

    public async getProductsStats() {
        const getProductsCritialStock = await this.getProductsByCriticalStockUC.execute()

        return {
            getProductsCritialStock
        }
    }

}