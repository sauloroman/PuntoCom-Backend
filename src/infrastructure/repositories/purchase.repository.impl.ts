import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { PurchaseDetailResponse, PurchaseDetailsResponse, FilterPurchase, PurchaseResponse } from "../../application/dtos/purchase.dto";
import { PurchaseDatasource } from "../../domain/datasources/purchase.datasource";
import { Purchase, PurchaseDetail } from "../../domain/entities";
import { PurchaseRepository } from "../../domain/repositories/purchase.repository";

export class PurchaseRepositoryImp implements PurchaseRepository {
    
    constructor( private readonly purchaseDatasource: PurchaseDatasource ){}
    
    async findByID(id: string): Promise<PurchaseDetailsResponse | null> {
        return await this.findByID(id)
    }

    async filterPurchases(pagination: PaginationDTO, filter: FilterPurchase): Promise<PaginationResponseDto<PurchaseDetailsResponse>> {
        return await this.filterPurchases(pagination, filter)
    }
    
    async savePurchaseDetails(purchaseDetail: PurchaseDetail): Promise<PurchaseDetailResponse> {
        return await this.purchaseDatasource.savePurchaseDetails(purchaseDetail)
    }

    async savePurchase(purchase: Purchase): Promise<PurchaseResponse> {
        return await this.purchaseDatasource.savePurchase(purchase)
    }

}