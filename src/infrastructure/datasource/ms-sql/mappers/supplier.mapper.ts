import { Supplier } from "../../../../domain/entities";
import { Email, Phone } from "../../../../domain/value-objects";

export class SupplierMapper {

    public static fromSQL(supplierData: any): Supplier {
        return new Supplier({
            id: supplierData.supplier_id,
            name: supplierData.supplier_name,
            lastname: supplierData.supplier_lastname,
            company: supplierData.supplier_company,
            email: new Email(supplierData.supplier_email),
            phone: new Phone(supplierData.supplier_phone),
            address: supplierData.supplier_address,
            isActive: supplierData.supplier_is_active,
            createdAt: supplierData.supplier_createdAt,
            updatedAt: supplierData.supplier_updatedAt
        })
    }

}