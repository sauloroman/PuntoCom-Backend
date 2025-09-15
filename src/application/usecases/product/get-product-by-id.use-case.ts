import { DatesAdapter } from "../../../config/plugins";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { ProductResponseIncludeDto } from "../../dtos/product.dto";
import { ApplicationError } from "../../errors/application.error";

export class GetProductByIdUseCase {

    private readonly MESSAGE_ERROR = 'GET_PRODUCT_BY_ID_ERROR' 

    constructor(private readonly productRepository: ProductRepository){}

    public async execute( productId: string ): Promise<ProductResponseIncludeDto> {

        const product = await this.productRepository.findById( productId )
        if ( !product ) throw new ApplicationError(`El producto con id ${productId} no existe`, this.MESSAGE_ERROR)            
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