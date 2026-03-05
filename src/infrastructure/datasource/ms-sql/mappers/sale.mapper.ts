import { SaleDetailRaw, SaleProductDetailResponse, SaleRaw, SaleResponse } from "../../../../application/dtos/sale.dto";
import { DatesAdapter } from "../../../../config/plugins";
import { Money } from "../../../../domain/value-objects";

export class SaleMapper {

    public static fromSQL(saleData: SaleRaw): SaleResponse {
        return {
            saleId: saleData.sale_id,
            saleTotal: new Money(parseFloat(`${saleData.sale_total}`)).value,
            saleDate: DatesAdapter.formatLocal(new Date(saleData.sale_date)),
            saleCode: saleData.sale_code,
            User: saleData.user_id ? {
                id: saleData.user_id ?? '',
                name: `${saleData.user_name} ${saleData.user_lastname}`,
                role: saleData.role ?? '',
                image: saleData.user_image ?? ''
            } : undefined
        }
    }

    public static fromSQLSaleDetail(saleDetailData: SaleDetailRaw): SaleProductDetailResponse {
         return {
            id: saleDetailData.sale_product_detail_id,
            saleQuantity: saleDetailData.sale_product_detail_quantity,
            saleUnitPrice: new Money(parseFloat(`${saleDetailData.sale_product_detail_unit_price}`)).value,
            saleDiscount: new Money(parseFloat(`${saleDetailData.sale_product_detail_discount}`)).value,
            productId: saleDetailData.product_id,
            saleId: saleDetailData.sale_id,
            Product: saleDetailData.product_id ? {
                id: saleDetailData.product_id,
                name: saleDetailData.product_name,
                code: saleDetailData.product_code
            } : undefined
        }
    }

}