import { Request, Response } from "express";
import { ReportService } from "../../application/services/report.service";

export class ReportController {

    constructor(private readonly reportService: ReportService){}

    public createListPdfReport = async (req: Request, res: Response) => {
        const { entity } = req.params
        const pdfUrl = await this.reportService.generateReport(entity)

        res.status(201).json({
            ok: true,
            message: 'Reporte creado correctamente',
            url: pdfUrl
        })
    }

    public getReport = async (req: Request, res: Response) => {
        const {entity, id} = req.params
        const {download} = req.query

        const filePath = await this.reportService.getReportById(entity, id)
        console.log(filePath)

        if ( download === 'true' ) {
            return res.download(filePath, `${id}.pdf`)
        }

        res.sendFile(filePath)
    }

    public deleteReport = async (req: Request, res: Response ) => {
        const { entity, id } = req.params
        
        await this.reportService.deteleReportById(entity, id)

        res.status(202).json({
            ok: true,
            message: 'El reporte ha sido eliminado correctamente'
        })
        
    }

    public getAllReports = async(_req: Request, res: Response) => {
        const reports = await this.reportService.getAllDateReports()
        res.status(200).json({
            ok: true,
            reports
        })
    }

}