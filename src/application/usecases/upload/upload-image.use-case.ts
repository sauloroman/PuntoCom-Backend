import { UploadedFile } from "express-fileupload";
import { FileUploadService } from "../../services/file-upload.service";

export class UploadImageUseCase {

    private readonly validExtentions = ['jpg', 'jpeg', 'png', 'webp', 'avif']

    constructor(private readonly uploadService: FileUploadService){}

    public async execute( folder: string, image: UploadedFile, id: string ): Promise<string> {
        const url = await this.uploadService.uploadFile({
            file: image,
            folder: `${folder}/${id}`,
            validExtentions: this.validExtentions,
            resourceType: 'image'
        })

        return url
    }


}