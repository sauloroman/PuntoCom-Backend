import { SalesRepository } from "../../../domain/repositories/sale.repository";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { SaleDetailsResponse } from "../../dtos/sale.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetSalesByUserUseCase {

    constructor(
        private readonly saleRepository: SalesRepository,
        private readonly userRepository: UserRepository
    ){}

    public async execute( userId: string, pagination: PaginationDTO ): Promise<PaginationResponseDto<SaleDetailsResponse>> {
        const existingUser = await this.userRepository.findById(userId)
        if ( !existingUser ) throw new ApplicationError(`El usuario con id ${userId} no existe`, 'USER_NOT_FOUND')        
        
        const sales = await this.saleRepository.findByUser(userId, pagination)
        return sales
    }

}