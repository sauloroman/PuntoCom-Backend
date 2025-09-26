import { buildProductsHtml, buildSuppliersHtml, buildUsersHtml } from "../../config/templates/pdf";
import { ProductResponseIncludeDto } from "../dtos/product.dto";
import { SupplierResponseDto } from "../dtos/supplier.dto";
import { UserResponseDtoI } from "../dtos/user.dto";
import { GetAllProductsUseCase } from "../usecases/product";
import { GetReportByIdUseCase } from "../usecases/reports/get-report-by-id.use-case";
import { GetAllSuppliersUseCase } from "../usecases/suppliers";
import { UploadPdfUseCase } from "../usecases/upload";
import { GetAllUsersUseCase } from "../usecases/user";

interface ReportServiceI {
    uploadReportUC: UploadPdfUseCase,
    getReportByIdUC: GetReportByIdUseCase,

    getAllUsersUC: GetAllUsersUseCase,
    getAllSuppliersUC: GetAllSuppliersUseCase,
    getAllProductsUC: GetAllProductsUseCase
}

export class ReportService {

    private readonly uploadReportUC: UploadPdfUseCase
    private readonly getReportByIdUC: GetReportByIdUseCase

    private readonly getAllUsersUC: GetAllUsersUseCase
    private readonly getAllSuppliersUC: GetAllSuppliersUseCase
    private readonly getAllProductsUC: GetAllProductsUseCase

    constructor({ 
        uploadReportUC,
        getReportByIdUC,
        
        getAllProductsUC,
        getAllSuppliersUC,
        getAllUsersUC
    }: ReportServiceI){
        this.uploadReportUC = uploadReportUC
        this.getReportByIdUC = getReportByIdUC

        this.getAllProductsUC = getAllProductsUC
        this.getAllSuppliersUC = getAllSuppliersUC
        this.getAllUsersUC = getAllUsersUC
    }

    public async getReportById( entity: string, id: string ) {
        return await this.getReportByIdUC.execute(entity, id)
    }

    public async generateReport( entity: string ): Promise<string> {
        switch(entity) {
            case 'users':
                const users = await this.getAllUsersUC.execute()
                return this.generateListUsersReport(users);
            case 'suppliers':
                const suppliers = await this.getAllSuppliersUC.execute()
                return this.generateListSuppliersReport(suppliers);
            case 'products':
                const products = await this.getAllProductsUC.execute()
                return this.generateListProductsReport(products);
            default:
                return ''
        }
    }

    private async generateListUsersReport( users: UserResponseDtoI[] ): Promise<string> {
        const html = buildUsersHtml(users)
        const pdfUrl = await this.uploadReportUC.execute(html, { folder: 'reports/users'})
        return pdfUrl
    }

    private async generateListSuppliersReport( suppliers: SupplierResponseDto[] ): Promise<string> {
        const html = buildSuppliersHtml(suppliers)
        const pdfUrl = await this.uploadReportUC.execute(html, { folder: 'reports/suppliers'})
        return pdfUrl
    }

    private async generateListProductsReport( products: ProductResponseIncludeDto[] ): Promise<string> {
        const html = buildProductsHtml(products)
        const pdfUrl = await this.uploadReportUC.execute(html, { folder: 'reports/products'})
        return pdfUrl
    }

}