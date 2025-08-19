import { UploadedFile } from "express-fileupload";
import { FileUploadService } from "../../services/file-upload.service";

export class UploadUserImageUseCase {

    private readonly folder = 'puntocom/users'
    private readonly validExtentions = ['jpg', 'jpeg', 'png', 'webp', 'avif']

    constructor(private readonly uploadService: FileUploadService){}

    public async execute( image: UploadedFile, userId: string ): Promise<string> {
        const url = await this.uploadService.uploadFile({
            file: image,
            folder: `${this.folder}/${userId}`,
            validExtentions: this.validExtentions,
            resourceType: 'image'
        })

        return url
    }


}