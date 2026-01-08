import { DatesAdapter } from "../../../config/plugins";
import { ProductRepository } from "../../../domain/repositories";
import { ProductResponseIncludeDto } from "../../dtos/product.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetProductByNameUseCase {

    private readonly MESSAGE_ERROR = 'GET_PRODUCT_BY_NAME_ERROR' 

    constructor(private readonly productRepository: ProductRepository){}

    public async execute( productName: string ): Promise<ProductResponseIncludeDto> {

        const product = await this.productRepository.findByName( productName )
        if ( !product ) throw new ApplicationError(`El producto con nombre ${productName} no existe`, this.MESSAGE_ERROR)            
        return {
            ...product,
            createdAt: DatesAdapter.formatLocal(
                DatesAdapter.toLocal(
                    typeof product.createdAt === 'string' ? new Date(product.createdAt) : product.createdAt
                )
            ),
            updatedAt: DatesAdapter.formatLocal(
                DatesAdapter.toLocal(
                    typeof product.updatedAt === 'string' ? new Date(product.updatedAt) : product.updatedAt
                )
            ),
        }
    
    }

}