import { CodeGeneratorAdapter, DatesAdapter, IDAdapter } from "../../../config/plugins";
import { Sale } from "../../../domain/entities";
import { SalesRepository } from "../../../domain/repositories";
import { Money } from "../../../domain/value-objects";
import { SaleResponse, SaveSale } from "../../dtos/sale.dto";
import { ApplicationError } from "../../errors/application.error";

export class SaveSaleUseCase {

    private MESSAGE_ERROR = "SALE_NOT_CREATED" 

    constructor(private readonly salesRepository: SalesRepository ){}

    public async execute( data: SaveSale ): Promise<SaleResponse> {

        const newSale = new Sale({
            id: IDAdapter.generate(),
            date: DatesAdapter.now(),
            total: new Money(data.total),
            code: CodeGeneratorAdapter.generateSaleCode(),
            userId: data.userId
        })

        const sale = await this.salesRepository.saveSale(newSale)
        if ( !sale ) throw new ApplicationError('No se pudo crear la venta', this.MESSAGE_ERROR)
        return sale            
    }

}