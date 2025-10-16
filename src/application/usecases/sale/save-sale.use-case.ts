import { CodeGeneratorAdapter, DatesAdapter } from "../../../config/plugins";
import { Sale } from "../../../domain/entities";
import { SalesRepository } from "../../../domain/repositories/sale.repository";
import { Money } from "../../../domain/value-objects";
import { SaleResponse, SaveSale } from "../../dtos/sale.dto";
import { ApplicationError } from "../../errors/application.error";

export class SaveSaleUseCase {

    private MESSAGE_ERROR = "SALE_NOT_CREATED" 

    constructor(private readonly salesRepository: SalesRepository ){}

    public async execute( data: SaveSale ): Promise<SaleResponse> {
        const newSale = new Sale({
            date: DatesAdapter.now(),
            total: new Money(data.total),
            code: CodeGeneratorAdapter.generateSaleCode(),
            userId: data.userId
        })

        const sale = await this.salesRepository.saveSale(newSale)
        if ( !sale ) throw new ApplicationError(this.MESSAGE_ERROR, 'No se pudo crear la venta')
        return sale            
    }

}