import { ReportService } from "../application/services"
import { GetAllInventoryAdjustmentsUseCase } from "../application/usecases/inventory-adjustment"
import { GetAllProductsUseCase } from "../application/usecases/product"
import { DeleteReportUseCase, GetAllReportsUseCase, GetReportByIdUseCase } from "../application/usecases/reports"
import { GetAllSuppliersUseCase } from "../application/usecases/suppliers"
import { UploadPdfUseCase } from "../application/usecases/upload"
import { GetAllUsersUseCase } from "../application/usecases/user"
import { MSSQLInventoryAdjustment, MSSQLProduct, MSSQLSuppliers, MSSQLUsers } from "../infrastructure/datasource/ms-sql"
import { 
    InventoryAdjustmentImp, 
    ProductRepositoryImp, 
    SupplierRepositoryImpl, 
    UserRepositoryImpl 
} from "../infrastructure/repositories"
import { 
    LocalFileUploadService, 
    PuppeteerPdfService 
} from "../infrastructure/services"

import { ReportController } from "../presentation/controllers"
import { ReportRoutes } from "../presentation/routes"

export class ReportContainer {

    public readonly reportRoutes: ReportRoutes

    constructor() {

        const userRepository = new UserRepositoryImpl( new MSSQLUsers() )
        const supplierRepository = new SupplierRepositoryImpl( new MSSQLSuppliers() )
        const productRepository = new ProductRepositoryImp( new MSSQLProduct() )
        const inventoryAdjustmentRepository = new InventoryAdjustmentImp( new MSSQLInventoryAdjustment() ) 

        const uploadFileService = new LocalFileUploadService()
        const pdfFileService = new PuppeteerPdfService()

        const uploadPdfUC = new UploadPdfUseCase( uploadFileService, pdfFileService )
        const getReportByIdUC = new GetReportByIdUseCase()

        const getAllUsersUC = new GetAllUsersUseCase(userRepository)
        const getAllSuppliersUC = new GetAllSuppliersUseCase(supplierRepository)
        const getAllProductsUC = new GetAllProductsUseCase(productRepository)
        const getAllInventoryAdjustments = new GetAllInventoryAdjustmentsUseCase( inventoryAdjustmentRepository )
        const getAllReportsUC = new GetAllReportsUseCase()
        const deleteReportByIdUC = new DeleteReportUseCase()

        const reportService = new ReportService({
            deleteReportByIdUC: deleteReportByIdUC,
            getAllInventoryAdjustmentsUC: getAllInventoryAdjustments,
            getAllProductsUC: getAllProductsUC,
            getAllReports: getAllReportsUC,
            getAllSuppliersUC: getAllSuppliersUC,
            getAllUsersUC: getAllUsersUC,
            getReportByIdUC: getReportByIdUC,
            uploadReportUC: uploadPdfUC,
        })

        const reportController = new ReportController(reportService)    

        this.reportRoutes = new ReportRoutes({
            controller: reportController
        })

    }

}