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

export interface UploadFileCloud {
    folder: string,
    resourceType: any
}
