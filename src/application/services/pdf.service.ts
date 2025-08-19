export interface PdfOptions {
    format?: 'A4' | 'Letter',
    printBackground?: boolean,
    path?: string
}

export abstract class PdfService {
    abstract generatePdf(html: string, options?: PdfOptions ): Promise<Buffer>
}