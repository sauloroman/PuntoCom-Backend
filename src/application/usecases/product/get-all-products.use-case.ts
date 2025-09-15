import { ProductRepository } from "../../../domain/repositories/product.repository";
import { ProductResponseIncludeDto } from "../../dtos/product.dto";

export class GetAllProductsUseCase {

    constructor(private readonly productRepository: ProductRepository){}

    public async execute(): Promise<ProductResponseIncludeDto[]> {
        const products = await this.productRepository.getAllProducts()
        return products
    }

}