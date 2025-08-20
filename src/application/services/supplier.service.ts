import { CreateSupplierRequestDto, UpdateSupplierRequestDto } from "../dtos/supplier.dto";
import { ChangeStatusSupplierUseCase, CreateSupplierUseCase, UpdateSupplierUseCase } from "../usecases/suppliers";

interface SupplierServiceI {
    createSupplierUC: CreateSupplierUseCase,
    updateSupplierUC: UpdateSupplierUseCase,
    changeSupplierStatusUC: ChangeStatusSupplierUseCase
}

export class SupplierService {

    private readonly createSupplierUC: CreateSupplierUseCase
    private readonly updateSupplierUC: UpdateSupplierUseCase
    private readonly changeSupplierStatusUC: ChangeStatusSupplierUseCase

    constructor({
        createSupplierUC,
        updateSupplierUC,
        changeSupplierStatusUC
    }: SupplierServiceI){
        this.createSupplierUC = createSupplierUC
        this.updateSupplierUC = updateSupplierUC
        this.changeSupplierStatusUC = changeSupplierStatusUC
    }

    public async createSupplier( dto: CreateSupplierRequestDto ) {
        const supplierCreated = await this.createSupplierUC.execute(dto)
        return supplierCreated
    }

    public async updateSupplier(dto: UpdateSupplierRequestDto) {
        const supplierUpdated = await this.updateSupplierUC.execute( dto )
        return supplierUpdated
    }

    public async deactivateSupplier(supplierId: string) {
        return await this.changeSupplierStatusUC.execute(supplierId, false)
    }

    public async activateSupplier(supplierId: string) {
        return await this.changeSupplierStatusUC.execute(supplierId, true)
    }
}