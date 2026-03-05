import { ConnectionPool } from "mssql";
import { PaginationDTO, PaginationResponseDto } from "../../../../application/dtos/pagination.dto";
import { ProductResponseIncludeDto, ProductInfo, StockCriteria, ProductRaw, FilterProducts } from "../../../../application/dtos/product.dto";
import { ProductDatasource } from "../../../../domain/datasources";
import { Product } from "../../../../domain/entities";
import { Stock } from "../../../../domain/value-objects";
import { InfrastructureError } from "../../../errors/infrastructure-error";
import { ProductMapper } from "../mappers/product.mapper";
import { buildMssqlPaginationOptions, buildProductsFilter } from "../utils";

const BASE_QUERY = `
    SELECT
        p.product_id,
        p.product_name,
        p.product_description,
        p.product_code,
        p.product_selling_price,
        p.product_stock,
        p.product_stock_min,
        p.product_image,
        p.product_image_code,
        p.product_createdAt,
        p.product_updatedAt,
        p.product_is_active,
        p.category_id,
        p.supplier_id,
        c.category_name,
        c.category_description,
        c.category_icon,
        c.category_is_active,
        s.supplier_name,
        s.supplier_lastname,
        s.supplier_company,
        s.supplier_phone,
        s.supplier_email,
        s.supplier_address,
        s.supplier_is_active
    FROM Product p
    INNER JOIN Category c ON p.category_id = c.category_id
    INNER JOIN Supplier s ON p.supplier_id = s.supplier_id
`

export class MSSQLProduct implements ProductDatasource {

    constructor(private readonly pool: ConnectionPool){}

    async findById(productId: string): Promise<ProductResponseIncludeDto | null> {
        try {
            const result = await this.pool.request()
                .input('product_id', productId)
                .query<ProductRaw>(`
                    ${BASE_QUERY}
                    WHERE product_id = @product_id 
                `)
                
            if ( !result.recordset[0] ) return null
            return ProductMapper.fromSQL( result.recordset[0] )
        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener el producto por id',
                'MSSQL_GET_PRODUCT_BY_ID_ERROR',
                error
            )
        }
    }

    async exists(productName: string): Promise<boolean> {
        try {
            const result = await this.pool.request()
                .input('product_name', productName)
                .query<ProductRaw>(`
                    ${BASE_QUERY}
                    WHERE product_name = @product_name
                `)

            if ( result.recordset[0] ) return true
            return false
        } catch( error ) {
            throw new InfrastructureError(
                'Error al buscar el producto por su nombre',
                'MSSQL_SEARCH_PRODUCT_BY_NAME_ERROR',
                error
            )
        }
    }

    async findByName(productName: string): Promise<ProductResponseIncludeDto | null> {
        try {
            const result = await this.pool.request()
                .input('product_name', `%${productName}%`)
                .query<ProductRaw>(`
                    ${BASE_QUERY}
                    WHERE product_name LIKE @product_name   
                `)

            if ( !result.recordset[0] ) return null
            return ProductMapper.fromSQL( result.recordset[0] )
        } catch(error) {
            throw new InfrastructureError(
                'Error al buscar el producto por su nombre',
                'MSSQL_SEARCH_PRODUCT_BY_NAME_ERROR',
                error
            )
        }
    }

    async create(product: Product): Promise<ProductResponseIncludeDto> {
        try {
            await this.pool.request()
                .input('product_id', product.id)
                .input('product_name',          product.name)
                .input('product_description',   product.description)
                .input('product_code',          product.code.value)
                .input('product_selling_price', product.sellingPrice.value)
                .input('product_stock',         product.stock.value)
                .input('product_stock_min',     product.stockMin.value)
                .input('product_image',         product.image)
                .input('product_image_code',    product.imageCode)
                .input('product_is_active',     product.isActive)
                .input('category_id',           product.categoryId)
                .input('supplier_id',           product.supplierId)
                .input('product_createdAt',     product.createdAt)
                .input('product_updatedAt',     product.updatedAt)
                .query(`
                    INSERT INTO Product (
                        product_id,
                        product_name,
                        product_description,
                        product_code,
                        product_selling_price,
                        product_stock,
                        product_stock_min,
                        product_image,
                        product_image_code,
                        product_is_active,
                        category_id,
                        supplier_id,
                        product_createdAt,
                        product_updatedAt
                    )
                    VALUES (
                        @product_id,
                        @product_name,
                        @product_description,
                        @product_code,
                        @product_selling_price,
                        @product_stock,
                        @product_stock_min,
                        @product_image,
                        @product_image_code,
                        @product_is_active,
                        @category_id,
                        @supplier_id,
                        @product_createdAt,
                        @product_updatedAt
                    )
                `)

            return (await this.findById(product.id))!
        } catch( error ) {
            throw new InfrastructureError(
                'Error al crear un producto',
                'MSSQL_CREATE_PRODUCT_ERROR',
                error
            )
        }
    }

    async update(product: Product): Promise<ProductResponseIncludeDto> {
        try {   
            await this.pool.request()
                .input('product_id',            product.id)
                .input('product_name',          product.name)
                .input('product_description',   product.description)
                .input('product_code',          product.code.value)
                .input('product_selling_price', product.sellingPrice.value)
                .input('product_stock',         product.stock.value)
                .input('product_stock_min',     product.stockMin.value)
                .input('product_image',         product.image)
                .input('product_image_code',    product.imageCode)
                .input('category_id',           product.categoryId)
                .input('supplier_id',           product.supplierId)
                .input('product_updatedAt',     product.updatedAt)
                .query(`
                    UPDATE Product
                    SET
                        product_name          = @product_name,
                        product_description   = @product_description,
                        product_code          = @product_code,
                        product_selling_price = @product_selling_price,
                        product_stock         = @product_stock,
                        product_stock_min     = @product_stock_min,
                        product_image         = @product_image,
                        product_image_code    = @product_image_code,
                        category_id           = @category_id,
                        supplier_id           = @supplier_id,
                        product_updatedAt     = @product_updatedAt
                    WHERE product_id = @product_id   
                `)
            
            return (await this.findById(product.id))!
        } catch(error) {
            throw new InfrastructureError(
                'Error al actualizar el producto',
                'MSSQL_UPDATE_PRODUCT_ERROR',
                error
            )
        }
    }

    async changeStatus(productId: string, status: boolean): Promise<ProductResponseIncludeDto> {
        try {
            await this.pool.request()
                .input('product_id', productId)
                .input('status', status)
                .query(`
                    UPDATE Product
                    SET product_is_active = @status
                    WHERE product_id = @product_id
                `);

            return (await this.findById(productId))!
        } catch(error) {
            throw new InfrastructureError(
                'Error al cambiar el estado del producto',
                'MSSQL_CHANGE_PRODUCT_STATUS_ERROR',
                error
            )
        }
    }

    async getAllProducts(): Promise<ProductResponseIncludeDto[]> {
        try {
            const result = await this.pool.request()
                .query<ProductRaw>(`
                    ${BASE_QUERY}
                    ORDER BY p.product_name DESC    
                `)

            return result.recordset.map( ProductMapper.fromSQL )
        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener todos los productos',
                'MSSQL_GET_ALL_PRODUCTS_ERROR',
                error
            )
        }
    }

    async filterProducts(pagination: PaginationDTO, filter: FilterProducts): Promise<PaginationResponseDto<ProductResponseIncludeDto>> {
        try {

            const { page, limit, offset } = buildMssqlPaginationOptions(pagination)
            
            const countRequest = this.pool.request()
            const dataRequest = this.pool.request()

            const countWhere = buildProductsFilter(countRequest, filter)
            const dataWhere = buildProductsFilter(dataRequest, filter)

            const countResult = await countRequest.query(`
                SELECT COUNT(*) AS total 
                FROM Product p
                    INNER JOIN Category c ON p.category_id = c.category_id
                    INNER JOIN Supplier s ON p.supplier_id = s.supplier_id
                WHERE ${countWhere}
            `)
            
            dataRequest.input('offset', offset).input('limit', limit)
            const dataResult = await dataRequest.query<ProductRaw>(`
                ${BASE_QUERY}
                WHERE ${dataWhere}
                ORDER BY p.product_createdAt DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `)

            const total = countResult.recordset[0].total
            const totalPages = Math.ceil(total / limit)

            return {
                items: dataResult.recordset.map( ProductMapper.fromSQL ),
                page: page,
                total: total,
                totalPages: totalPages
            }   

        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener los productos filtrados',
                'MSSQL_GET_FILTERED_PRODUCTS_ERROR',
                error
            )
        }
    }

    async getMinimalInformationProducts(): Promise<ProductInfo[]> {
        try {
            const result = await this.pool.request()
                .query<Pick<ProductRaw, 'product_id' | 'product_name' | 'product_stock'>>(`
                    SELECT product_id, product_name, product_stock
                    FROM Product
                    ORDER BY product_name DESC
                `)

            return result.recordset.map( row => ({
                productId: row.product_id,
                productName: row.product_name,
                productStock: new Stock(row.product_stock).value
            }))

        } catch( error ) {
            throw new InfrastructureError(
                'Error al obtener la información minima de los productos',
                'MSSQL_GET_MINIMAL_PRODUCTS_ERROR',
                error
            );
        }
    }

    async getProductsByStock(stockCriteria: StockCriteria): Promise<ProductResponseIncludeDto[]> {
        try {
            const result = await this.pool.request()
                .query<ProductRaw>(`
                    ${BASE_QUERY}
                    ORDER BY p.product_name DESC
                `);

            return result.recordset
                .filter(product => {
                    const stockPercentage = (product.product_stock / product.product_stock_min) * 100;

                    switch (stockCriteria) {
                        case StockCriteria.low:     return stockPercentage <= 20;
                        case StockCriteria.warning: return stockPercentage > 20 && stockPercentage <= 60;
                        case StockCriteria.normal:  return stockPercentage > 60;
                        default:                    return false;
                    }
                })
                .map(ProductMapper.fromSQL);
        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener los productos por criterio de stock',
                'MSSQL_GET_PRODUCTS_BY_STOCK_ERROR',
                error
            );
        }
    }

}