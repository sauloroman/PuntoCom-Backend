import { CreateSupplierRequestDto, UpdateSupplierRequestDto } from "../dtos/supplier.dto";
import { CreateSupplierUseCase, UpdateSupplierUseCase } from "../usecases/suppliers";

interface SupplierServiceI {
    createSupplierUC: CreateSupplierUseCase,
    updateSupplierUC: UpdateSupplierUseCase
}

export class SupplierService {

    private readonly createSupplierUC: CreateSupplierUseCase
    private readonly updateSupplierUC: UpdateSupplierUseCase

    constructor({
        createSupplierUC,
        updateSupplierUC
    }: SupplierServiceI){
        this.createSupplierUC = createSupplierUC
        this.updateSupplierUC = updateSupplierUC
    }

    public async createSupplier( dto: CreateSupplierRequestDto ) {
        const supplierCreated = await this.createSupplierUC.execute(dto)
        return supplierCreated
    }

    public async updateSupplier(dto: UpdateSupplierRequestDto) {
        const supplierUpdated = await this.updateSupplierUC.execute( dto )
        return supplierUpdated
    }

}