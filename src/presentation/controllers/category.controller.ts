import { Request, Response } from "express";
import { CategoryService } from "../../application/services/category.service";
import { CreateCategoryValidator } from "../validators/category";
import { ApplicationError } from "../../application/errors/application.error";
import { UpdateCategoryValidator } from "../validators/category/update-category.validator";

export class CategoryController {

    constructor( private readonly categoryService: CategoryService){}

    public createCategory = async ( req: Request, res: Response ) => {

        const [ dto, error ] = CreateCategoryValidator.validate( req.body )
        if ( error ) throw new ApplicationError(error, 'CREATE_CATEGORY_VALIDATION_ERROR')

        const category = await this.categoryService.createCategory( dto! )

        res.status(201).json({
            ok: true,
            message: 'La categoría ha sido creada existosamente',
            category: category
        })
    }

    public getCategoryById = async (req: Request, res: Response ) => {
        const { id: categoryId } = req.params
        const category = await this.categoryService.getCategoryById( categoryId )
        res.status(200).json({
            ok: true,
            category
        })
    }

    public updateCategory = async (req: Request, res: Response) => {
        const { id: categoryId } = req.params
        const [ dto, error ] = UpdateCategoryValidator.validate( req.body )
        if ( error ) throw new ApplicationError(error, 'UPDATE_CATEGORY_VALIDATOR_ERROR')
        const category = await this.categoryService.updateCategory({ id: categoryId, ...dto })
        res.status(200).json({
            ok: true,
            message: 'La categoría ha sido actualizada correctamente',
            category
        })
    }

    public activateCategory = async (req: Request, res: Response) => {
        const { id: categoryId } = req.params
        const category = await this.categoryService.changeCategoryStatus(categoryId, true)
        res.status(200).json({
            ok: true,
            message: 'La categoría ha sido activada exitosamente',
            category
        })
    }

    public deactivateCategory = async (req: Request, res: Response) => {
        const { id: categoryId } = req.params
        const category = await this.categoryService.changeCategoryStatus(categoryId, false)
        res.status(200).json({
            ok: true,
            message: 'La categoría ha sido desactivada exitosamente',
            category
        })
    }

    public getCategories = async (req: Request, res: Response ) => {
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
        } = await this.categoryService.listCategories(pagination)

        return res.status(200).json({
            ok: true,
            meta: {
                page: currentPage,
                totalPages,
                total,
            },
            categories: items
        })

    } 

    public uploadCategoryImage = async (req: Request, res: Response) => {
        const { id: categoryId } = req.params
        const { files } = req.body
        const image = files[0]

        const category = await this.categoryService.uploadCategoryImage(image, categoryId)

        res.status(200).json({
            ok: true,
            message: 'La imagen de la categoría ha sido actualizada correctamente',
            category
        })
    }

}