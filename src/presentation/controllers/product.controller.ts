import { Request, Response } from "express";
import { ProductService } from "../../application/services/product.service";
import { CreateProductValidator, UpdateProductValidator } from "../validators/product";
import { ApplicationError } from "../../application/errors/application.error";

export class ProductController {

    constructor( private readonly productService: ProductService ){}

    public generateListProductsReport = async (req: Request, res: Response) => {
        const pdfUrl = await this.productService.generateListProductsReport()
        res.status(200).json({
            ok: true,
            message: 'Reporte de products generado existosamente',
            url: pdfUrl
        })
    }

    public uploadProductImage = async (req: Request, res: Response) => {
        const { id: productId } = req.params
        const { files } = req.body
        const image = files[0]

        const product = await this.productService.uploadProductImage(image, productId)

        res.status(200).json({
            ok: true,
            message: 'La imagen del producto ha sido actualizada correctamente',
            product
        })
    }

    public getProductById = async (req: Request, res: Response) => {
        const {id: productId} = req.params
        const product = await this.productService.getProductById( productId )
        res.status(200).json({
            ok: true,
            product
        })
    }

    public createProduct = async (req: Request, res: Response) => {
        const [ dto, error ] = CreateProductValidator.validate(req.body)
        if ( error ) throw new ApplicationError(error, 'CREATE_PRODUCT_ERROR')
        const productCreated = await this.productService.createProduct(dto!)
        res.status(201).json({
            ok: true,
            message: `Producto ${dto?.name} creado correctamente`,
            product: productCreated,
        })
    }

    public updateProduct = async (req: Request, res: Response) => {
        const { id: productId } = req.params
        const [ dto, error ] = UpdateProductValidator.validate( req.body )
        if ( error ) throw new ApplicationError(error, 'UPDATE_PRODUCT_ERROR')
        const productUpdated = await this.productService.updateProduct({ id: productId, ...dto! })
        res.status(200).json({
            ok: true,
            message: 'Producto Actualizado correctamente',
            product: productUpdated 
        })
    }

    public deactivateProduct = async (req: Request, res: Response) => {
        const { id: productId } = req.params
        const productUpdated = await this.productService.changeStatus({ id: productId, status: false })
        res.status(200).json({
            ok: true,
            message: 'El producto ha sido desactivado',
            product: productUpdated
        })
    }

    public activateProduct = async (req: Request, res: Response) => {
        const { id: productId } = req.params
        const productUpdated = await this.productService.changeStatus({ id: productId, status: true })
        res.status(200).json({
            ok: true,
            message: 'El producto ha sido activado',
            product: productUpdated
        })
    }

    public getProducts = async (req: Request, res: Response) => {
        const { page, limit } = req.query
        const sort = (req as any).sort
        const filter = (req as any).filter

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sort: sort as string,
            filter: filter as string
        }

        const {
            items,
            page: currentPage,
            total,
            totalPages
        } = await this.productService.listSuppliers( pagination )
    
        res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total
            },
            products: items
        })

    }

}