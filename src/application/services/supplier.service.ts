import { PaginationDTO } from "../dtos/pagination.dto";
import { CreateSupplierRequestDto, UpdateSupplierRequestDto } from "../dtos/supplier.dto";
import { 
    ChangeStatusSupplierUseCase, 
    CreateSupplierUseCase, 
    GetAllSuppliersUseCase, 
    GetSupplierByIdUseCase, 
    ListSuppliersUseCase, 
    UpdateSupplierUseCase 
} from "../usecases/suppliers";
import { GetUniqueCompaniesSupplier } from "../usecases/suppliers/get-unique-companies-supplier.use-case";

interface SupplierServiceI {
    createSupplierUC: CreateSupplierUseCase,
    updateSupplierUC: UpdateSupplierUseCase,
    changeSupplierStatusUC: ChangeStatusSupplierUseCase
    getSupplierByIdUC: GetSupplierByIdUseCase
    getAllSuppliersUC: GetAllSuppliersUseCase
    listSuppliersUC: ListSuppliersUseCase
    getUniqueCompaniesSupplierUC: GetUniqueCompaniesSupplier
}

export class SupplierService {

    private readonly createSupplierUC: CreateSupplierUseCase
    private readonly updateSupplierUC: UpdateSupplierUseCase
    private readonly changeSupplierStatusUC: ChangeStatusSupplierUseCase
    private readonly getSupplierByIdUC: GetSupplierByIdUseCase
    private readonly getAllSuppliersUC: GetAllSuppliersUseCase
    private readonly listSuppliersUC: ListSuppliersUseCase
    private readonly getUniqueCompaniesSupplierUC: GetUniqueCompaniesSupplier

    constructor({
        createSupplierUC,
        updateSupplierUC,
        changeSupplierStatusUC,
        getSupplierByIdUC,
        getAllSuppliersUC,
        listSuppliersUC,
        getUniqueCompaniesSupplierUC
    }: SupplierServiceI){
        this.createSupplierUC = createSupplierUC
        this.updateSupplierUC = updateSupplierUC
        this.changeSupplierStatusUC = changeSupplierStatusUC
        this.getSupplierByIdUC = getSupplierByIdUC
        this.getAllSuppliersUC = getAllSuppliersUC
        this.listSuppliersUC = listSuppliersUC
        this.getUniqueCompaniesSupplierUC = getUniqueCompaniesSupplierUC
    }

    public async getUniqueCompanies() {
        return await this.getUniqueCompaniesSupplierUC.execute()
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

    public async getSupplierById(supplierId: string) {
        return await this.getSupplierByIdUC.execute(supplierId)
    }

    public async getAllSuppliers() {
        return await this.getAllSuppliersUC.execute()
    }

    public async listSuppliers(pagination: PaginationDTO) {
        return await this.listSuppliersUC.execute(pagination)
    }
}