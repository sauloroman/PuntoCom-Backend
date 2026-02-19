import { PaginationDTO, PaginationResponseDto } from "../../application/dtos/pagination.dto";
import { ProductInfo, ProductResponseIncludeDto, StockCriteria } from "../../application/dtos/product.dto";
import { ProductDatasource } from "../../domain/datasources/product.datasource";
import { Product } from "../../domain/entities";
import { ProductRepository } from "../../domain/repositories/product.repository";

export class ProductRepositoryImp implements ProductRepository {

    constructor(private readonly productDatasource: ProductDatasource){}
    
    async getAllProducts(): Promise<ProductResponseIncludeDto[]> {
        return await this.productDatasource.getAllProducts()
    }
    
    async getProductsByStock(stockCriteria: StockCriteria): Promise<ProductResponseIncludeDto[]> {
        return await this.productDatasource.getProductsByStock(stockCriteria)
    }
    
    async findById(productId: string): Promise<ProductResponseIncludeDto | null> {
        return await this.productDatasource.findById(productId)
    }
    
    async exists(productName: string): Promise<boolean> {
        return await this.productDatasource.exists(productName)
    }

    async findByName(productName: string): Promise<ProductResponseIncludeDto | null> {
        return await this.productDatasource.findByName(productName)
    }

    async create(product: Product): Promise<ProductResponseIncludeDto> {
        return await this.productDatasource.create(product)
    }

    async update(product: Product): Promise<ProductResponseIncludeDto> {
        return await this.productDatasource.update(product)
    }

    async changeStatus(productId: string, status: boolean): Promise<ProductResponseIncludeDto> {
        return await this.productDatasource.changeStatus(productId, status)
    }

    async getProducts(pagination: PaginationDTO): Promise<PaginationResponseDto<ProductResponseIncludeDto>> {
        return await this.productDatasource.getProducts(pagination)
    }

    async getMinimalInformationProducts(): Promise<ProductInfo[]> {
        return await this.productDatasource.getMinimalInformationProducts()
    }


}