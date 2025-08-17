import { Request, Response } from "express";
import { CategoryService } from "../../application/services/category.service";
import { CreateCategoryValidator } from "../validators/category";
import { ApplicationError } from "../../application/errors/application.error";

export class CategoryController {

    constructor( private readonly categoryService: CategoryService){}

    public createCategory = async ( req: Request, res: Response ) => {

        const [ dto, error ] = CreateCategoryValidator.validate( req.body )
        if ( error ) throw new ApplicationError(error, 'CREATE_CATEGORY_VALIDATION_ERROR')

        const category = await this.categoryService.createCategory( dto! )

        res.status(201).json({
            ok: true,
            msg: 'La categoría ha sido creada existosamente',
            category: category
        })
    }

}