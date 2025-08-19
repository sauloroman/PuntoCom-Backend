import { User } from "../../../domain/entities";
import { FileUploadService } from "../../services";

export class DestroyUserImageUseCase {

    constructor(private readonly uploadService: FileUploadService){}

    public async execute( userImageUrl: string ) {
        if (!userImageUrl) return

        await this.uploadService.removeFile({
            path: userImageUrl,
            resourceType: 'image'
        })
    }

}