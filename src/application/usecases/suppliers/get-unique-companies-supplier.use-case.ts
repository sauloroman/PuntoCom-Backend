import { SupplierRepository } from "../../../domain/repositories";

export class GetUniqueCompaniesSupplier {

    constructor(private readonly supplierRepository: SupplierRepository){}

    public async execute(): Promise<string[]> {
        const uniqueCompanies = await this.supplierRepository.getUniqueCompanies()
        return uniqueCompanies
    }

}