import { RemoveFileI, UploadFileCloud, UploadFileI } from "../../infrastructure/interfaces/upload-file.interface";

export abstract class FileUploadService {
    abstract uploadFile( data: UploadFileI ): Promise<string>
    abstract removeFile( data: RemoveFileI ): Promise<boolean | null>
    abstract uploadBuffer(buffer: Buffer, options: UploadFileCloud): Promise<string>
}