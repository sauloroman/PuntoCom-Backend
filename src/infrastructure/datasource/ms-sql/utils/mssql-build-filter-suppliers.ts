import { FilterSuppliers } from "../../../../application/dtos/supplier.dto";
import { MssqlClient } from "../datasources";

export const buildSupplierFilter = (
    request: Awaited<ReturnType<typeof MssqlClient.getConnection>> extends { request: () => infer R } ? R : any,
    filter: FilterSuppliers
) => {

    const baseWhere = '1 = 1'
    const conditions: string[] = [baseWhere]

    if (filter.status === 0 || filter.status === 1) {
        request.input('status', filter.status)
        conditions.push('supplier_is_active = @status')
    }

    if ( filter.supplierName ) {
        const str = filter.supplierName.toLowerCase()
        conditions.push(`supplier_name LIKE '%${str}%' OR supplier_lastname LIKE '%${str}%'`)
    }

    if ( filter.company ) {
        request.input('company', filter.company)
        conditions.push('supplier_company = @company')
    }

    return conditions.join(' AND ')
}