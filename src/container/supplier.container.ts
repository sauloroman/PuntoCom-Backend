import { ConnectionPool } from "mssql"
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
import { MSSQLSuppliers } from "../infrastructure/datasource/ms-sql/datasources/mssql-supplier.datasource"
import { SupplierRepositoryImpl } from "../infrastructure/repositories"
import { SupplierController } from "../presentation/controllers"
import { SupplierRoutes } from "../presentation/routes"
import { Auth } from "../presentation/middlewares"

export class SupplierContainer {

    public readonly supplierRoutes: SupplierRoutes

    constructor(private readonly pool: ConnectionPool) {

        const supplierRepositoryMSSQL = new SupplierRepositoryImpl( new MSSQLSuppliers() )   

        const createSupplierUseCase = new CreateSupplierUseCase( supplierRepositoryMSSQL ) 
        const updateSupplierUseCase = new UpdateSupplierUseCase( supplierRepositoryMSSQL )
        const changeSupplierStatusUseCase = new ChangeStatusSupplierUseCase( supplierRepositoryMSSQL )
        const getSupplierByIdUseCase = new GetSupplierByIdUseCase(supplierRepositoryMSSQL )
        const getAllSuppliersUseCase = new GetAllSuppliersUseCase(supplierRepositoryMSSQL )
        const listSuppliersUseCase = new ListSuppliersUseCase( supplierRepositoryMSSQL )
        const getUniqueCompaniesUseCase = new GetUniqueCompaniesSupplier( supplierRepositoryMSSQL )

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

        const auth = new Auth( this.pool )

        this.supplierRoutes = new SupplierRoutes({
            controller: supplierController,
            auth: auth
        })

    }

}