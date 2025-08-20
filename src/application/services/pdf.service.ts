import { UserResponseDtoI } from "../dtos/user.dto";

export interface PdfOptions {
    format?: 'A4' | 'Letter',
    printBackground?: boolean,
    path?: string
}

export abstract class PdfService {
    abstract generatePdf(html: string, options?: PdfOptions ): Promise<Buffer>
    abstract generateUsersReport(users: UserResponseDtoI[],  options?: PdfOptions & {folder: string}): Promise<Buffer>
}