import { CreateSupplierRequestDto } from "../dtos/supplier.dto";
import { CreateSupplierUseCase } from "../usecases/suppliers";

interface SupplierServiceI {
    createSupplierUC: CreateSupplierUseCase
}

export class SupplierService {

    private readonly createSupplierUC: CreateSupplierUseCase

    constructor({
        createSupplierUC
    }: SupplierServiceI){
        this.createSupplierUC = createSupplierUC
    }

    public async createSupplier( dto: CreateSupplierRequestDto ) {
        const supplierCreated = await this.createSupplierUC.execute(dto)
        return supplierCreated
    }

}