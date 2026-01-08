import { Request, Response } from "express";
import { DashboardStatsService } from "../../application/services";

export class DashboardStatsController {

    constructor(private readonly dashboardStatsService: DashboardStatsService ){}

    public getGeneralStats = async ( _req: Request, res: Response ) => {
        const stats = await this.dashboardStatsService.getGeneralStats()
        res.status(200).json({
            ok: true,
            stats
        })
    }

     public getSalesChart = async (_req: Request, res: Response) => {
        const chart = await this.dashboardStatsService.getSalesChart()
        res.status(200).json({
            ok: true,
            chart
        })
    }

    public getPurchasesChart = async (_req: Request, res: Response) => {
        const chart = await this.dashboardStatsService.getPurchasesChart()
        res.status(200).json({
            ok: true,
            chart
        })
    }

    public getTopProducts = async (_req: Request, res: Response) => {
        const products = await this.dashboardStatsService.getTopProducts()
        res.status(200).json({
            ok: true,
            products
        })
    }

    public getProductsWithoutSales = async (_req: Request, res: Response) => {
        const products = await this.dashboardStatsService.getProductsWithoutSales()
        res.status(200).json({
            ok: true,
            products
        })
    }

}