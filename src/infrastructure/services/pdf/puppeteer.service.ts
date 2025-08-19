import { PdfOptions, PdfService } from "../../../application/services/pdf.service";
import puppeteer from "puppeteer";

export class PuppeteerPdfService implements PdfService {
    
    async generatePdf(html: string, options?: PdfOptions): Promise<Buffer> {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setContent(html, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
            format: options?.format || 'A4',
            printBackground: options?.printBackground ?? true,
            path: options?.path
        })

        await browser.close()
        return Buffer.from(pdfBuffer)
    }

}