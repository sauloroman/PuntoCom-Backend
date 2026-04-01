import { Request, Response } from "express";
import { DashboardStatsService } from "../../application/services";

export class DashboardStatsController {

    constructor(private readonly dashboardStatsService: DashboardStatsService ){}

    public getKPISStats = async (_req: Request, res: Response ) => {
        const kpis = await this.dashboardStatsService.getKpisStats()
        res.status(200).json({
            ok: true,
            kpis
        })
    }

    public getSalesStats = async (_req: Request, res: Response) => {
        const stats = await this.dashboardStatsService.getSalesStats()
        res.status(200).json({
            ok: true,
            stats
        })
    }

    public getPurchasesStats = async (_req: Request, res: Response) => {
        const stats = await this.dashboardStatsService.getPurchasesStats()
        res.status(200).json({
            ok: true,
            stats
        })
    }

    public getProductsStats = async (_req: Request, res: Response) => {
        const stats = await this.dashboardStatsService.getProductsStats()
        res.status(200).json({
            ok: true,
            stats
        })
    }
}