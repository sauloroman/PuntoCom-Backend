import { PurchaseDetailRaw, PurchaseDetailResponse, PurchaseRaw, PurchaseResponse } from "../../../../application/dtos/purchase.dto";
import { DatesAdapter } from "../../../../config/plugins";
import { Money } from "../../../../domain/value-objects";

export class PurchaseMapper {

    public static fromSQL(purchaseData: PurchaseRaw): PurchaseResponse  {
        return {
            purchaseId: purchaseData.purchase_id,
            puchaseTotal: new Money(parseFloat(`${purchaseData.purchase_total}`)).value,
            purchaseDate: DatesAdapter.formatLocal(new Date(purchaseData.purchase_date)),
            Supplier: purchaseData.supplier_id ? {
                id: purchaseData.supplier_id ?? '',
                name: `${purchaseData.supplier_name} ${purchaseData.supplier_lastname}`,
                phone: purchaseData.supplier_phone ?? '',
            } : undefined,
            User: purchaseData.user_id ? {
                id: purchaseData.user_id ?? '',
                name: `${purchaseData.user_name} ${purchaseData.user_lastname}`,
                role: purchaseData.role ?? '',
                image: purchaseData.user_image ?? ''
            } : undefined
        }
    }

    public static fromSQLPurchaseDetail(purchaseDetailData: PurchaseDetailRaw): PurchaseDetailResponse {
        return {
            id: purchaseDetailData.purchase_detail_id,
            purchaseQuantity: purchaseDetailData.purchase_quantity,
            purchaseUnitPrice: new Money(parseFloat(`${purchaseDetailData.purchase_unit_price}`)).value,
            productId: purchaseDetailData.product_id,
            purchaseId: purchaseDetailData.purchase_id,
            Product: purchaseDetailData.product_id ? {
                productId: purchaseDetailData.product_id,
                productName: purchaseDetailData.product_name,
                productImage: purchaseDetailData.product_image
            }: undefined
        }
    }

}