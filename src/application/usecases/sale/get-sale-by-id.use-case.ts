import { SalesRepository } from "../../../domain/repositories";
import { SaleDetailsResponse } from "../../dtos/sale.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetSaleByIdUseCase {

    private MESSAGE_ERROR = "SALE_NOT_FOUND" 

    constructor( private readonly saleRepository: SalesRepository ){}

    public async execute( saleId: string ): Promise<SaleDetailsResponse> {
        if ( !saleId ) throw new ApplicationError('El id de la venta es obligatorio')

        const sale = await this.saleRepository.findById(saleId)

        if ( !sale ) throw new ApplicationError(`La venta con id ${saleId} no existe`, this.MESSAGE_ERROR)
        
        return sale
    }

}