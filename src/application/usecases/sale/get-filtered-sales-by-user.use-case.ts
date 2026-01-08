import { SalesRepository } from "../../../domain/repositories/sale.repository";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { SaleDetailsResponse, SaleFilters } from "../../dtos/sale.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetFilteredSalesByUserUseCase {

    constructor(
        private readonly saleRepository: SalesRepository,
        private readonly userRepositoy: UserRepository
    ){}

    public async execute( userId: string, filter: SaleFilters, pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        const existingUser = await this.userRepositoy.findById(userId)
        
        if ( !existingUser ) throw new ApplicationError(`El usuario con id ${userId} no existe`, 'USER_NOT_FOUND')        
       
        if ( !filter.prices && !filter.dates ) {
            return await this.saleRepository.findByUser(userId, pagination)
        }

        return await this.saleRepository.getFilteredSalesByUser(userId, filter, pagination)
    }

}