import { EnvAdapter } from "../../../config/plugins";
import { FileUploadService, RemoveFileI, UploadFileCloud, UploadFileI } from "../../../application/services/file-upload.service";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { v2 as cloudinary } from 'cloudinary'
import { UploadedFile } from "express-fileupload";
import streamifier from 'streamifier'


cloudinary.config( EnvAdapter.CLOUDINARY_URL )

export class CloudinaryFileUploadService implements FileUploadService {
    
    private extractPublicId(url: string): string {
        const match = url.match(/puntocom\/.+(?=\.[^./]+$)/)
        if (!match) throw new Error('No se pudo extraer publicId')
        return match[0]
    }

    public async uploadFile(data: UploadFileI): Promise<string> {
        try {
            const { file, validExtentions, folder, resourceType } = data    
        
            const ext = (file as UploadedFile).mimetype.split('/')[1] ?? ''
            if ( !validExtentions.includes(ext) ) {
                throw new InfrastructureError(
                    `Invalid Extention: ${ext}. Valid ones ${validExtentions}`,
                    'UPLOAD_FILE_CLOUDINARY_EXTENTION_ERROR'
                )
            }
    
            const { tempFilePath } = (file as UploadedFile)
            const { secure_url: fileUrl } = await cloudinary.uploader.upload(
                tempFilePath,
                {
                    folder,
                    type: 'upload',
                    resource_type: resourceType
                }
            )
    
            return fileUrl
        } catch( error ) {
            throw new InfrastructureError(
                `No fue posible subir el archivo a Cloudinary`,
                'UPLOAD_FILE_CLOUDINARY_ERROR',
                error
            )
        }
    }

    public async removeFile(data: RemoveFileI): Promise<boolean | null> {
        try {

            const { path: fileUrl, resourceType } = data
            const publicId = this.extractPublicId(fileUrl);

            await cloudinary.api.delete_resources(
                [publicId],
                {type: 'upload', resource_type: resourceType }
            )

            return true

        } catch(error) {
            throw new InfrastructureError(
                `No fue posible eliminar el archivo de Cloudinary`,
                'REMOVE_FILE_CLOUDINARY_ERROR',
                error
            )
        }
    }

    public async uploadBuffer(buffer: Buffer, options: UploadFileCloud): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: options.folder,
                    type: 'upload',
                    resource_type: options.resourceType,
                },
                (error, result) => {
                    if (error) return reject(error)
                    if (!result) return reject(new Error('Upload result is empty'))
                    resolve(result.secure_url)
                }
            )

            streamifier.createReadStream(buffer).pipe(uploadStream)
        })
    }


}

