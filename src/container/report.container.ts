import { ReportService } from "../application/services/report.service";
import { GetAllSuppliersUseCase } from "../application/usecases/suppliers";
import { UploadPdfUseCase } from "../application/usecases/upload";
import { GetAllUsersUseCase } from "../application/usecases/user";
import { UserRepositoryImpl } from "../infrastructure/repositories/user.repository.impl";
import { LocalFileUploadService } from "../infrastructure/services/file-upload/local.service";
import { PuppeteerPdfService } from "../infrastructure/services/pdf/puppeteer.service";
import { ReportRoutes } from "../presentation/routes";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaUserDatasource } from "../infrastructure/datasource/prisma/prisma-user.datasource";
import { PrismaProductDatasource } from "../infrastructure/datasource/prisma/prisma-product.datasource";
import { ProductRepositoryImp } from "../infrastructure/repositories/product.repository.impl";
import { SupplierRepositoryImpl } from "../infrastructure/repositories/supplier.repository.impl";
import { PrismaSupplierDatasource } from "../infrastructure/datasource/prisma/prisma-supplier.datasource";
import { GetAllProductsUseCase } from "../application/usecases/product";
import { ReportController } from "../presentation/controllers/report.controller";
import { GetReportByIdUseCase } from "../application/usecases/reports/get-report-by-id.use-case";

const prismaClient = PrismaDatasource.getInstance() 

export class ReportContainer {

    public readonly reportRoutes: ReportRoutes

    constructor() {

        const userRepository = new UserRepositoryImpl(
            new PrismaUserDatasource( prismaClient )
        )
        const productRepository = new ProductRepositoryImp(
            new PrismaProductDatasource( prismaClient )
        )
        const supplierRepository = new SupplierRepositoryImpl(
            new PrismaSupplierDatasource( prismaClient )
        )

        const uploadFileService = new LocalFileUploadService()
        const pdfFileService = new PuppeteerPdfService()

        const uploadPdfUC = new UploadPdfUseCase( uploadFileService, pdfFileService )
        const getReportByIdUC = new GetReportByIdUseCase()

        const getAllUsersUC = new GetAllUsersUseCase(userRepository)
        const getAllSuppliersUC = new GetAllSuppliersUseCase(supplierRepository)
        const getAllProductsUC = new GetAllProductsUseCase(productRepository)

        const reportService = new ReportService({
            uploadReportUC: uploadPdfUC,
            getReportByIdUC: getReportByIdUC,

            getAllProductsUC: getAllProductsUC,
            getAllSuppliersUC: getAllSuppliersUC,
            getAllUsersUC: getAllUsersUC
        })

        const reportController = new ReportController(reportService)    

        this.reportRoutes = new ReportRoutes({
            controller: reportController
        })

    }

}