import path from 'path'
import fs from 'fs'
import { IDAdapter } from '../../../config/plugins';
import { FileUploadService, RemoveFileI, UploadFileI } from "../../../application/services/file-upload.service";
import { InfrastructureError } from '../../errors/infrastructure-error';
import { UploadedFile } from 'express-fileupload';

export class LocalFileUploadService implements FileUploadService {
    
    private readonly baseDir = path.join(__dirname, '../../../uploads')

    private checkFolder( folderPath: string ) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, {recursive: true})
        }
    }

    public async uploadFile(data: UploadFileI): Promise<string> {
        try {
            const { file, folder, validExtentions } = data
    
            const ext = (file as UploadedFile).mimetype.split('/')[1] ?? ''
    
            if ( !validExtentions.includes(ext) ) {
                throw new InfrastructureError(
                    `Invalid Extention: ${ext}. Valid ones ${validExtentions}`,
                    'UPLOAD_FILE_EXTENTION_ERROR'
                )
            } 
            
            const destination = path.join(this.baseDir, folder)
            this.checkFolder( destination )
            
            const fileName = `${IDAdapter.generate()}.${ext}`
            const filePath = `${destination}/${fileName}`;
            (file as UploadedFile).mv(filePath)
    
            return `${folder}/${fileName}`

        } catch( error ) {
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

            if ( fs.existsSync( fullPath ) ) {
                fs.unlinkSync( fullPath )
                return true
            } 

            return false
        } catch( error ) {
            throw new InfrastructureError(
                `No fue posible eliminar el archivo del servidor local`,
                'REMOVE_FILE_ERROR',
                error
            )
        }
    }

}