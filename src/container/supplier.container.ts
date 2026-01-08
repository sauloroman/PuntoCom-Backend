import { SupplierService } from "../application/services"
import { 
    ChangeStatusSupplierUseCase, 
    CreateSupplierUseCase, 
    GetAllSuppliersUseCase, 
    GetSupplierByIdUseCase, 
    GetUniqueCompaniesSupplier, 
    ListSuppliersUseCase, 
    UpdateSupplierUseCase 
} from "../application/usecases/suppliers"

import { PrismaDatasource, PrismaSupplierDatasource } from "../infrastructure/datasource/prisma"
import { SupplierRepositoryImpl } from "../infrastructure/repositories"

import { SupplierController } from "../presentation/controllers"
import { SupplierRoutes } from "../presentation/routes"

export class SupplierContainer {

    public readonly supplierRoutes: SupplierRoutes

    constructor() {

        const supplierRepository = new SupplierRepositoryImpl(
            new PrismaSupplierDatasource( PrismaDatasource.getInstance() )
        )   

        const createSupplierUseCase = new CreateSupplierUseCase( supplierRepository ) 
        const updateSupplierUseCase = new UpdateSupplierUseCase( supplierRepository )
        const changeSupplierStatusUseCase = new ChangeStatusSupplierUseCase( supplierRepository )
        const getSupplierByIdUseCase = new GetSupplierByIdUseCase(supplierRepository)
        const getAllSuppliersUseCase = new GetAllSuppliersUseCase(supplierRepository)
        const listSuppliersUseCase = new ListSuppliersUseCase( supplierRepository )
        const getUniqueCompaniesUseCase = new GetUniqueCompaniesSupplier( supplierRepository )

        const supplierService = new SupplierService({
            createSupplierUC: createSupplierUseCase,
            updateSupplierUC: updateSupplierUseCase,
            changeSupplierStatusUC: changeSupplierStatusUseCase,
            getSupplierByIdUC: getSupplierByIdUseCase,
            getAllSuppliersUC: getAllSuppliersUseCase,
            listSuppliersUC: listSuppliersUseCase,
            getUniqueCompaniesSupplierUC: getUniqueCompaniesUseCase,
        })

        const supplierController = new SupplierController( supplierService )

        this.supplierRoutes = new SupplierRoutes({
            controller: supplierController
        })

    }

}