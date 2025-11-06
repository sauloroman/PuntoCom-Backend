import { ProductRepository } from "../../../domain/repositories/product.repository";
import { ProductResponseIncludeDto, StockCriteria } from "../../dtos/product.dto";

export class GetProductsByStock {

    constructor(private readonly productRepository: ProductRepository){}

    public async execute( stockCriteria: StockCriteria ): Promise<ProductResponseIncludeDto[]> {
        const products = await this.productRepository.getProductsByStock(stockCriteria)
        return products
    }

}