import { ProductRepository } from "../../../domain/repositories/product.repository";
import { ProductResponseIncludeDto } from "../../dtos/product.dto";

export class GetAllProductsUseCase {

    constructor(private readonly productRepository: ProductRepository){}

    public async execute(): Promise<ProductResponseIncludeDto[]> {
        return await this.productRepository.getAllProducts()
    }

}