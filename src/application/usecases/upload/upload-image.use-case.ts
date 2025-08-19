import { UploadedFile } from "express-fileupload";
import { FileUploadService } from "../../services/file-upload.service";

export class UploadImageUseCase {

    private readonly validExtentions = ['jpg', 'jpeg', 'png', 'webp', 'avif']

    constructor(private readonly uploadService: FileUploadService){}

    public async execute( folder: string, image: UploadedFile, userId: string ): Promise<string> {
        const url = await this.uploadService.uploadFile({
            file: image,
            folder: `${folder}/${userId}`,
            validExtentions: this.validExtentions,
            resourceType: 'image'
        })

        return url
    }


}