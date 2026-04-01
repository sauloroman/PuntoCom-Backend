import { DashboardStatsDatasource } from "../../../domain/datasources";
import { SalesByCategory } from "../../dtos/dashboard-stats.dto";

export class GetSalesByCategoryUseCase {

    constructor(private readonly dashboardDatasource: DashboardStatsDatasource ){}

    public async execute(): Promise<SalesByCategory[]> {
        return await this.dashboardDatasource.getSalesByCategory()
    }

}