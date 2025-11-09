import { InventoryAdjustmentRepository } from "../../../domain/repositories/inventory-adjustment.repository";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { InventoryAdjustmentResponse } from "../../dtos/inventory-adjustment.dto";
import { PaginationDTO, PaginationResponseDto } from "../../dtos/pagination.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetInventoryAdjustmentByUserUseCase {

    constructor(
        private readonly inventoryAdjustmentRepository: InventoryAdjustmentRepository,
        private readonly userRepository: UserRepository
    ){}

    public async execute( userId: string, pagination: PaginationDTO ): Promise<PaginationResponseDto<InventoryAdjustmentResponse>> {

        const existingUser = await this.userRepository.findById(userId)
        if ( !existingUser ) throw new ApplicationError(`El usuario con id ${userId} no existe`, 'USER_NOT_FOUND_ERROR')

        return await this.inventoryAdjustmentRepository.getInventoryAdjustmentsByUser( userId, pagination )
    }

}