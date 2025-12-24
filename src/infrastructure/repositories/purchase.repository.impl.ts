import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { PurchaseDetailResponse, PurchaseDetailsReponse, PurchaseResponse } from "../../application/dtos/purchase.dto";
import { PurchaseDatasource } from "../../domain/datasources/purchase.datasource";
import { Purchase, PurchaseDetail } from "../../domain/entities";
import { PurchaseRepository } from "../../domain/repositories/purchase.repository";

export class PurchaseRepositoryImp implements PurchaseRepository {
    
    constructor( private readonly purchaseDatasource: PurchaseDatasource ){}
    
    async getPurchases(pagination: PaginationDTO): Promise<PaginationResponseDto<PurchaseDetailsReponse>> {
        return await this.purchaseDatasource.getPurchases(pagination)
    }
    
    async savePurchaseDetails(purchaseDetail: PurchaseDetail): Promise<PurchaseDetailResponse> {
        return await this.purchaseDatasource.savePurchaseDetails(purchaseDetail)
    }

    async savePurchase(purchase: Purchase): Promise<PurchaseResponse> {
        return await this.purchaseDatasource.savePurchase(purchase)
    }

}