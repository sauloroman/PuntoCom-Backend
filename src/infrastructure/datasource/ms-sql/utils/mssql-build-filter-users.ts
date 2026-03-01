import { FilterUsers } from "../../../../application/dtos/user.dto"
import { MssqlClient } from "../datasources/mssql-client"

export const buildUserFilter = (
    request: Awaited<ReturnType<typeof MssqlClient.getConnection>> extends { request: () => infer R } ? R : any,
    filter: FilterUsers
) => {
    const baseWhere = '1 = 1'
    const conditions: string[] = [baseWhere]

    if (filter.role) {
        request.input('role', filter.role)
        conditions.push('role = @role')
    }

    if (filter.status === 0 || filter.status === 1) {
        request.input('status', filter.status)
        conditions.push('user_is_active = @status')
    }

    return conditions.join(' AND ')
}