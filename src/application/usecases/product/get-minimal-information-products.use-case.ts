import { ProductRepository } from "../../../domain/repositories/product.repository";
import { ProductInfo } from "../../dtos/product.dto";

export class GetMinimalInformationProductsUseCase {

    constructor(private readonly productRepository: ProductRepository){}

    public async execute(): Promise<ProductInfo[]> {
        const products = await this.productRepository.getMinimalInformationProducts()
        return products
    }

}