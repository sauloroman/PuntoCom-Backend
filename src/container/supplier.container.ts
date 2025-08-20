import { SupplierService } from "../application/services";
import { ChangeStatusSupplierUseCase, CreateSupplierUseCase, UpdateSupplierUseCase } from "../application/usecases/suppliers";
import { PrismaDatasource } from "../infrastructure/datasource/prisma/prisma-client";
import { PrismaSupplierDatasource } from "../infrastructure/datasource/prisma/prisma-supplier.datasource";
import { SupplierRepositoryImpl } from "../infrastructure/repositories/supplier.repository.impl";
import { SupplierController } from "../presentation/controllers/supplier.controller";
import { SupplierRoutes } from "../presentation/routes";

export class SupplierContainer {

    public readonly supplierRoutes: SupplierRoutes

    constructor() {

        const supplierRepository = new SupplierRepositoryImpl(
            new PrismaSupplierDatasource( PrismaDatasource.getInstance() )
        )   

        const createSupplierUseCase = new CreateSupplierUseCase( supplierRepository ) 
        const updateSupplierUseCase = new UpdateSupplierUseCase( supplierRepository )
        const changeSupplierStatusUseCase = new ChangeStatusSupplierUseCase( supplierRepository )

        const supplierService = new SupplierService({
            createSupplierUC: createSupplierUseCase,
            updateSupplierUC: updateSupplierUseCase,
            changeSupplierStatusUC: changeSupplierStatusUseCase
        })

        const supplierController = new SupplierController( supplierService )

        this.supplierRoutes = new SupplierRoutes({
            controller: supplierController
        })

    }

}