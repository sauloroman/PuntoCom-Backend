import { 
    GetDashboardStatsUseCase, 
    GetProductsWithoutSalesUseCase, 
    GetPurchasesByDateUseCase, 
    GetSalesByDateUseCase, 
    GetTopSellingProductUseCase 
} from "../usecases/dashboard";

interface DashboardStatsServiceOptions {
    getDashboardStatsUC: GetDashboardStatsUseCase,
    getSalesChartUC: GetSalesByDateUseCase,
    getPurchasesChartUC: GetPurchasesByDateUseCase,
    getTopProductsUC: GetTopSellingProductUseCase,
    getProductsWithoutSalesUC: GetProductsWithoutSalesUseCase
}

export class DashboardStatsService {

    private readonly getDashboardStatsUC: GetDashboardStatsUseCase
    private readonly getSalesChartUC: GetSalesByDateUseCase
    private readonly getPurchasesChartUC: GetPurchasesByDateUseCase
    private readonly getTopProductsUC: GetTopSellingProductUseCase
    private readonly getProductsWithoutSalesUC: GetProductsWithoutSalesUseCase

    constructor({
        getDashboardStatsUC,
        getProductsWithoutSalesUC, 
        getPurchasesChartUC, 
        getSalesChartUC,
        getTopProductsUC
    }: DashboardStatsServiceOptions){
        this.getDashboardStatsUC = getDashboardStatsUC
        this.getProductsWithoutSalesUC = getProductsWithoutSalesUC
        this.getPurchasesChartUC = getPurchasesChartUC
        this.getSalesChartUC = getSalesChartUC
        this.getTopProductsUC = getTopProductsUC
    }

    public async getGeneralStats() {
        return await this.getDashboardStatsUC.execute()
    }

    public async getSalesChart() {
        return await this.getSalesChartUC.execute()
    }

    public async getPurchasesChart() {
        return await this.getPurchasesChartUC.execute()
    }

    public async getTopProducts() {
        return await this.getTopProductsUC.execute()
    }

    public async getProductsWithoutSales() {
        return await this.getProductsWithoutSalesUC.execute()
    }

}