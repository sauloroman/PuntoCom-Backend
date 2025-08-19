export interface UploadFileI {
    file: any,
    folder: string,
    validExtentions: string[],
    resourceType: any
}

export interface RemoveFileI {
    path: string,
    resourceType: any
}

export abstract class FileUploadService {

    abstract uploadFile( data: UploadFileI ): Promise<string>
    abstract removeFile( data: RemoveFileI ): Promise<boolean | null>

}