import puppeteer from "puppeteer";
import { UserResponseDtoI } from "../../../application/dtos/user.dto";
import { PdfService } from "../../../application/services";
import { buildUsersHtml } from "../../../config/templates/pdf";
import { PdfOptions } from "../../interfaces/pdf.interface";

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