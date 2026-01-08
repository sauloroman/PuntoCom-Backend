import { PdfOptions } from "../../infrastructure/interfaces/pdf.interface";
import { UserResponseDtoI } from "../dtos/user.dto";

export abstract class PdfService {
    abstract generatePdf(html: string, options?: PdfOptions ): Promise<Buffer>
    abstract generateUsersReport(users: UserResponseDtoI[],  options?: PdfOptions & {folder: string}): Promise<Buffer>
}