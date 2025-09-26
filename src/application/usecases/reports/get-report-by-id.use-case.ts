import path from "path";
import fs from 'fs'
import { ApplicationError } from "../../errors/application.error";

export class GetReportByIdUseCase {

    private readonly uploadsDir = path.join(__dirname, '../../../uploads/reports')

    public async execute( entity: string, pdfId: string ) {

        const filePath = path.join(this.uploadsDir, entity, `${pdfId}.pdf`)

        if ( !filePath.startsWith(path.join(this.uploadsDir, entity))) {
            throw new ApplicationError('Ruta no válida')
        }

        if ( !fs.existsSync(filePath) ) {
            throw new ApplicationError('Archivo no encontrado')
        }

        return filePath
    }

}