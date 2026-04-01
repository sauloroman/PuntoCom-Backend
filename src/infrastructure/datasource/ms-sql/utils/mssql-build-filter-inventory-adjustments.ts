import { FilterInventoryAdjustment } from "../../../../application/dtos/inventory-adjustment.dto";
import { MssqlClient } from "../datasources";

export const buildInventoryAdjustmentsFilter = (
    request: Awaited<ReturnType<typeof MssqlClient.getConnection>> extends { request: () => infer R } ? R : any,
    filter: FilterInventoryAdjustment
) => {

    const baseWhere = '1 = 1'
    const conditions: string[] = [baseWhere]

    if ( filter.adjustmentType ) {
        request.input('type', filter.adjustmentType)
        conditions.push('adjustment_type = @type')
    }

    if ( filter.userId ) {
        request.input('userId', filter.userId)
        conditions.push('ia.user_id = @userId')
    }

    return conditions.join(' AND ')
}