import { SupplierService } from "../application/services";
import { ChangeStatusSupplierUseCase, CreateSupplierUseCase, GetAllSuppliersUseCase, ListSuppliersUseCase, UpdateSupplierUseCase } from "../application/usecases/suppliers";
import { GetSupplierByIdUseCase } from "../application/usecases/suppliers/get-supplier-by-id.use-case";
import { UploadPdfUseCase } from "../application/usecases/upload";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaSupplierDatasource } from "../infrastructure/datasource/prisma/prisma-supplier.datasource";
import { SupplierRepositoryImpl } from "../infrastructure/repositories/supplier.repository.impl";
import { CloudinaryFileUploadService } from "../infrastructure/services/file-upload/cloudinary.service";
import { PuppeteerPdfService } from "../infrastructure/services/pdf/puppeteer.service";
import { SupplierController } from "../presentation/controllers/supplier.controller";
import { SupplierRoutes } from "../presentation/routes";

export class SupplierContainer {

    public readonly supplierRoutes: SupplierRoutes

    constructor() {

        const supplierRepository = new SupplierRepositoryImpl(
            new PrismaSupplierDatasource( PrismaDatasource.getInstance() )
        )   

        const uploadService = new CloudinaryFileUploadService()
        const pdfService = new PuppeteerPdfService()

        const createSupplierUseCase = new CreateSupplierUseCase( supplierRepository ) 
        const updateSupplierUseCase = new UpdateSupplierUseCase( supplierRepository )
        const changeSupplierStatusUseCase = new ChangeStatusSupplierUseCase( supplierRepository )
        const getSupplierByIdUseCase = new GetSupplierByIdUseCase(supplierRepository)
        const getAllSuppliersUseCase = new GetAllSuppliersUseCase(supplierRepository)
        const listSuppliersUseCase = new ListSuppliersUseCase( supplierRepository )
        const uploadListSuppliersUseCase = new UploadPdfUseCase( uploadService, pdfService )

        const supplierService = new SupplierService({
            createSupplierUC: createSupplierUseCase,
            updateSupplierUC: updateSupplierUseCase,
            changeSupplierStatusUC: changeSupplierStatusUseCase,
            getSupplierByIdUC: getSupplierByIdUseCase,
            getAllSuppliersUC: getAllSuppliersUseCase,
            listSuppliersUC: listSuppliersUseCase,
            uploadSupplierReportUC: uploadListSuppliersUseCase
        })

        const supplierController = new SupplierController( supplierService )

        this.supplierRoutes = new SupplierRoutes({
            controller: supplierController
        })

    }

}