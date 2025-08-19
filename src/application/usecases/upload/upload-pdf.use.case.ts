import fs from 'fs'
import path from 'path';
import { UploadedFile } from "express-fileupload";
import { FileUploadService } from "../../services";
import { PdfOptions, PdfService } from "../../services/pdf.service";
import { IDAdapter } from '../../../config/plugins';

export class UploadPdfUseCase {

    private readonly validExtentions = ['pdf']

    constructor(
        private readonly pdfService: PdfService,
        private readonly uploadFileService: FileUploadService
    ){}

    public async execute( html: string, options?: PdfOptions & {folder: string} ): Promise<string> {

        const buffer = await this.pdfService.generatePdf(html, options)
        const tempPath = path.join(__dirname, `${IDAdapter.generate()}.pdf`)
        fs.writeFileSync(tempPath, buffer)
    
        const fileUrl = await this.uploadFileService.uploadFile({
            file: { tempFilePath: tempPath, mimetype: 'application/pdf'} as UploadedFile,
            folder: options?.folder ?? 'reports',
            validExtentions: this.validExtentions,
            resourceType: 'raw'
        })
    
        fs.unlinkSync(tempPath)
        
        return fileUrl
    }

}