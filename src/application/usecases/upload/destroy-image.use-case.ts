import { FileUploadService } from "../../services";

export class DestroyImageUseCase {

    constructor(private readonly uploadService: FileUploadService){}

    public async execute( imageUrl: string ) {
        if (!imageUrl) return

        await this.uploadService.removeFile({
            path: imageUrl,
            resourceType: 'image'
        })
    }

}