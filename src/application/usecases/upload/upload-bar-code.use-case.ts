import { BarCodeAdapter } from "../../../config/plugins";
import { FileUploadService } from "../../services";

export class UploadBarCodeUseCase {

    constructor(private readonly uploadImageService: FileUploadService){}

    public async execute( folder: string, code: string, id: string ) {
        const imageCode = await BarCodeAdapter.generate(code)
        const urlImageCode = await this.uploadImageService.uploadBuffer(imageCode, {
            folder: `${folder}/${id}`,
            resourceType: 'image',
        }) 
        return urlImageCode
    }

}