import { SaleProductDetailResponse, SaleResponse } from "../../application/dtos/sale.dto";
import { Sale, SaleProductDetail } from "../../domain/entities";
import { SalesRepository } from "../../domain/repositories/sale.repository";

export class SalesRepositoryImpl implements SalesRepository {
    
    constructor(private readonly salesRepository: SalesRepository){}
    
    async saveSaleDetails(data: SaleProductDetail): Promise<SaleProductDetailResponse> {
        return await this.salesRepository.saveSaleDetails(data)
    }

    async findById(id: string): Promise<SaleResponse | null> {
        return await this.salesRepository.findById(id)
    }

    async saveSale(data: Sale): Promise<SaleResponse> {
        return await this.salesRepository.saveSale(data)
    }

}