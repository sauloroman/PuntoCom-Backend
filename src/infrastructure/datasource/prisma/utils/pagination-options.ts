import { PaginationDTO } from "../../../../application/dtos/pagination.dto";

export function buildPaginationOptions(dto: PaginationDTO) {
  const page = Number(dto.page) || 1;
  const limit = Number(dto.limit) || 10;
  const skip = (page - 1) * limit;

  let orderBy: any =dto.sort;
  let where: any = dto.filter;

  return { skip, take: limit, where, orderBy, page, limit };
}
