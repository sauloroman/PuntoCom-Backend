import { ProductRepository } from "../../../domain/repositories";
import { ChangeStatusDto, ProductResponseIncludeDto } from "../../dtos/product.dto";
import { ApplicationError } from "../../errors/application.error";

export class ChangeStatusProductUseCase {

    private readonly MESSAGE_ERROR = 'GET_PRODUCT_NOT_FOUND'

    constructor(private readonly productRepository: ProductRepository ){}

    public async execute( data: ChangeStatusDto ): Promise<ProductResponseIncludeDto> {

        const productFromDB = await this.productRepository.findById( data.id )
        if ( !productFromDB ) throw new ApplicationError(`El producto con id ${data.id} no existe`, this.MESSAGE_ERROR)
        if ( data.status && productFromDB.isActive ) throw new ApplicationError('El producto ya está activo')
        if ( !data.status && !productFromDB.isActive ) throw new ApplicationError('El producto ya está inactivo')

        const product = await this.productRepository.changeStatus( data.id, data.status )
        return product
    }

}