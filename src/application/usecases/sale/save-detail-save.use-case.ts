import { DatesAdapter } from "../../../config/plugins";
import { SaleProductDetail } from "../../../domain/entities";
import { SalesRepository } from "../../../domain/repositories/sale.repository";
import { Discount, Money, Quantity } from "../../../domain/value-objects";
import { SaleDetail, SaleProductDetailResponse } from "../../dtos/sale.dto";

export class SaveDetailSaleUseCase {

    constructor(private readonly saleRepository: SalesRepository){}

    public async execute( saleId: string, data: SaleDetail ): Promise<SaleProductDetailResponse> {
       
        const detail = new SaleProductDetail({
            productId: data.productId,
            saleId: saleId,
            saleQuantity: new Quantity(data.quantity),
            saleUnitPrice: new Money(data.unitPrice),
            saleDiscount: new Discount(data.discount),
            createdAt: DatesAdapter.now(),
            updatedAt: DatesAdapter.now()
        })

        return await this.saleRepository.saveSaleDetails( detail )
    }   

}