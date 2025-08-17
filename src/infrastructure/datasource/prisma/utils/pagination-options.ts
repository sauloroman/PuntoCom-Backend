import { PaginationDTO } from "../../../../application/dtos/pagination.dto";

export function buildPaginationOptions(dto: PaginationDTO) {
  const page = Number(dto.page) || 1;
  const limit = Number(dto.limit) || 10;
  const skip = (page - 1) * limit;

  let orderBy: any = undefined;
  if (dto.sort) {
    const [field, order] = dto.sort.split(':'); // user_name:asc
    orderBy = { [field]: order };
  }

  let where: any = undefined;
  if (dto.filter) {
    try {
      where = JSON.parse(dto.filter);
    } catch {}
  }

  return { skip, take: limit, where, orderBy, page, limit };
}
