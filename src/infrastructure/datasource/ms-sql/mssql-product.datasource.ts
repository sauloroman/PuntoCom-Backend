import { PaginationDTO, PaginationResponseDto } from "../../../application/dtos/pagination.dto";
import { ProductResponseIncludeDto, ProductInfo, StockCriteria, ProductRaw } from "../../../application/dtos/product.dto";
import { ProductDatasource } from "../../../domain/datasources";
import { Product } from "../../../domain/entities";
import { Money, ProductCode, Stock } from "../../../domain/value-objects";
import { InfrastructureError } from "../../errors/infrastructure-error";
import { MssqlClient } from "./mssql-client";
import { buildMssqlPaginationOptions } from "./utils/mssql-pagination-options";

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
    
    private toDomain(row: ProductRaw): ProductResponseIncludeDto {
        return {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            code: new ProductCode(row.product_code).value,
            sellingPrice: new Money(parseFloat(`${row.product_selling_price}`)).value,
            stock: new Stock(row.product_stock).value,
            stockMin: new Stock(row.product_stock_min).value,
            image: row.product_image,
            imageCode: row.product_image_code,
            createdAt: row.product_createdAt,
            updatedAt: row.product_updatedAt,
            isActive: row.product_is_active,
            categoryId: row.category_id,
            supplierId: row.supplier_id,
            Category: row.category_id ? {
                id: row.category_id ,
                name: row.category_name ?? '',
                description: row.category_description ?? '',
                icon: row.category_icon ?? '',
                isActive: row.category_is_active ?? false
            }: undefined,
            Supplier: row.supplier_id ? {
                id: row.supplier_id,
                name: row.supplier_name ?? '',
                lastname: row.supplier_lastname ?? '',
                company: row.supplier_company ?? '',
                phone: row.supplier_phone ?? '',
                email: row.supplier_email ?? '',
                address: row.supplier_address ?? '',
                isActive: row.supplier_is_active ?? false
            }: undefined
        }
    }

    async findById(productId: string): Promise<ProductResponseIncludeDto | null> {
        try {
            const pool = await MssqlClient.getConnection()
            const result = await pool.request()
                .input('product_id', productId)
                .query<ProductRaw>(`
                    ${BASE_QUERY}
                    WHERE product_id = @product_id 
                `)
                
            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )
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
            const pool = await MssqlClient.getConnection()
            const result = await pool.request()
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
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
                .input('product_name', `%${productName}%`)
                .query<ProductRaw>(`
                    ${BASE_QUERY}
                    WHERE product_name LIKE @product_name   
                `)

            if ( !result.recordset[0] ) return null
            return this.toDomain( result.recordset[0] )
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
            const pool = await MssqlClient.getConnection()

            await pool.request()
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
            const pool = await MssqlClient.getConnection()

            await pool.request()
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
            const pool = await MssqlClient.getConnection()
            await pool.request()
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
            const pool = await MssqlClient.getConnection()
            const result = await pool.request()
                .query<ProductRaw>(`
                    ${BASE_QUERY}
                    ORDER BY p.product_name DESC    
                `)

            return result.recordset.map( this.toDomain )
        } catch(error) {
            throw new InfrastructureError(
                'Error al obtener todos los productos',
                'MSSQL_GET_ALL_PRODUCTS_ERROR',
                error
            )
        }
    }

    async getProducts(pagination: PaginationDTO): Promise<PaginationResponseDto<ProductResponseIncludeDto>> {
        try {
            const pool = await MssqlClient.getConnection();

            const { limit, offset, orderBy, page, where } = buildMssqlPaginationOptions(pagination, 'product_createdAt');

            const [ productsResult, countResult ] = await Promise.all([
                pool.request()
                    .input('limit',  limit)
                    .input('offset', offset)
                    .query<ProductRaw>(`
                        ${BASE_QUERY}
                        WHERE ${where}
                        ORDER BY ${orderBy}
                        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
                    `),

                pool.request()
                    .query(`SELECT COUNT(*) AS total FROM Product p WHERE ${where}`)
            ]);

            const total      = countResult.recordset[0].total;
            const totalPages = Math.ceil(total / limit);

            return {
                items: productsResult.recordset.map(row => this.toDomain(row)),
                total,
                page,
                totalPages
            };
        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener los productos paginados',
                'MSSQL_GET_PRODUCTS_PAGINATED_ERROR',
                error
            );
        }
    }

    async getMinimalInformationProducts(): Promise<ProductInfo[]> {
        try {
            const pool = await MssqlClient.getConnection()

            const result = await pool.request()
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
            const pool = await MssqlClient.getConnection();

            const result = await pool.request()
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
                .map(row => this.toDomain(row));
        } catch (error) {
            throw new InfrastructureError(
                'Error al obtener los productos por criterio de stock',
                'MSSQL_GET_PRODUCTS_BY_STOCK_ERROR',
                error
            );
        }
    }

}