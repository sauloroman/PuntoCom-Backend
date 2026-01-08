import fs from 'fs'
import path from 'path';
import { UploadedFile } from "express-fileupload";
import { FileUploadService, PdfOptions, PdfService  } from "../../services";
import { IDAdapter } from '../../../config/plugins';

export class UploadPdfUseCase {

    private readonly validExtentions = ['pdf']

    constructor(
        private readonly uploadFileService: FileUploadService,
        private readonly pdfService: PdfService
    ){}

    public async execute( html: string, options?: PdfOptions & {folder: string} ): Promise<string> {
        
        const tempPath = path.join(__dirname, `${IDAdapter.generate()}.pdf`)
        const buffer = await this.pdfService.generatePdf(html)

        fs.writeFileSync(tempPath, buffer)
    
        const fileUrl = await this.uploadFileService.uploadFile({
            file: { tempFilePath: tempPath, mimetype: 'application/pdf'} as UploadedFile,
            folder: options?.folder ?? 'reports',
            validExtentions: this.validExtentions,
            resourceType: 'auto'
        })
    
        return fileUrl
    }

}