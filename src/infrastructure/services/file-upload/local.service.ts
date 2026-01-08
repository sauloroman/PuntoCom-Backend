import path from 'path'
import fs from 'fs'
import { UploadedFile } from 'express-fileupload';
import { IDAdapter } from '../../../config/plugins';
import { FileUploadService } from "../../../application/services";
import { InfrastructureError } from '../../errors/infrastructure-error';
import { RemoveFileI, UploadFileCloud, UploadFileI } from '../../interfaces/upload-file.interface';

export class LocalFileUploadService implements FileUploadService {
    
    private readonly baseDir = path.join(__dirname, '../../../uploads')

    private checkFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }
    }

    public async uploadFile(data: UploadFileI): Promise<string> {
        try {
            const { file, folder, validExtentions } = data
    
            const ext = file.mimetype.split('/')[1] ?? ''
    
            if (!validExtentions.includes(ext)) {
                throw new InfrastructureError(
                    `Invalid Extension: ${ext}. Valid ones ${validExtentions}`,
                    'UPLOAD_FILE_EXTENSION_ERROR'
                )
            } 
            
            const destination = path.join(this.baseDir, folder)
            this.checkFolder(destination)
            
            const fileName = `${IDAdapter.generate()}.${ext}`
            const filePath = `${destination}/${fileName}`

            // Caso 1: express-fileupload
            if ('mv' in file && typeof (file as UploadedFile).mv === 'function') {
                await (file as UploadedFile).mv(filePath)
            } 
            // Caso 2: archivo generado internamente (ej. PDF)
            else if ('tempFilePath' in file) {
                fs.renameSync((file as any).tempFilePath, filePath)
            } 
            else {
                throw new InfrastructureError(
                    'El archivo no tiene un método mv ni un tempFilePath',
                    'UPLOAD_FILE_ERROR'
                )
            }
    
            return `uploads/${folder}/${fileName}`

        } catch (error) {
            throw new InfrastructureError(
                `No fue posible subir el archivo al servidor local`,
                'UPLOAD_FILE_ERROR',
                error
            )
        }
    }

    public async removeFile(data: RemoveFileI): Promise<boolean | null> {
        try {
            const { path: fileRelativePath } = data

            const fullPath = path.join(this.baseDir, fileRelativePath)

            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath)
                return true
            } 

            return false
        } catch(error) {
            throw new InfrastructureError(
                `No fue posible eliminar el archivo del servidor local`,
                'REMOVE_FILE_ERROR',
                error
            )
        }
    }

    uploadBuffer(buffer: Buffer, options: UploadFileCloud): Promise<string> {
        throw new Error('Method not implemented.');
    }
}
