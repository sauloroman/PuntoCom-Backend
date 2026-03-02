import { ProductRaw, ProductResponseIncludeDto } from "../../../../application/dtos/product.dto";
import { Money, ProductCode, Stock } from "../../../../domain/value-objects";

export class ProductMapper {

    public static fromSQL(row: ProductRaw): ProductResponseIncludeDto {
        return {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            code: new ProductCode(row.product_code).value,
            sellingPrice: new Money(parseFloat(`${row.product_selling_price}`)).value,
            stock: new Stock(row.product_stock).value,
            stockMin: new Stock(row.product_stock_min).value,
            image: row.product_image,
            imageCode: row.product_image_code,
            createdAt: row.product_createdAt,
            updatedAt: row.product_updatedAt,
            isActive: row.product_is_active,
            categoryId: row.category_id,
            supplierId: row.supplier_id,
            Category: row.category_id ? {
                id: row.category_id,
                name: row.category_name ?? '',
                description: row.category_description ?? '',
                icon: row.category_icon ?? '',
                isActive: row.category_is_active ?? false
            } : undefined,
            Supplier: row.supplier_id ? {
                id: row.supplier_id,
                name: row.supplier_name ?? '',
                lastname: row.supplier_lastname ?? '',
                company: row.supplier_company ?? '',
                phone: row.supplier_phone ?? '',
                email: row.supplier_email ?? '',
                address: row.supplier_address ?? '',
                isActive: row.supplier_is_active ?? false
            } : undefined
        }
    }

}