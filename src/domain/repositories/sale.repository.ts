import { SaleProductDetailResponse, SaleResponse } from "../../application/dtos/sale.dto";
import { Sale, SaleProductDetail } from "../entities";

export abstract class SalesRepository {
    abstract saveSale( data: Sale ): Promise<SaleResponse>
    abstract saveSaleDetails( data: SaleProductDetail ): Promise<SaleProductDetailResponse>
    abstract findById( id: string ): Promise<SaleResponse | null> 
}