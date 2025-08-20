import { UserResponseDtoI } from "../../../application/dtos/user.dto";
import { PdfOptions, PdfService } from "../../../application/services/pdf.service";
import puppeteer from "puppeteer";
import { buildUsersHtml } from "../../../config/templates/pdf";

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

    async generateUsersReport(users: UserResponseDtoI[],  options?: PdfOptions & {folder: string}): Promise<Buffer> {
        const html = buildUsersHtml(users)
        const buffer = await this.generatePdf(html, options)
        return buffer
    }

}