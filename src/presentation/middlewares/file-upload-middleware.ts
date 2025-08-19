import { NextFunction, Request, Response } from "express";

export class FileUploadMiddleware {

    public static validateContainFiles( req: Request, res: Response, next: NextFunction ): any {

        const files = req.files

        if ( !files || Object.keys(files).length === 0 ) {
        return res.status(400).json({ error: 'No se ha seleccionado ningun archivo' })
        }

        if ( !Array.isArray( files.files ) ) {
            req.body.files = [ files.files ]
        } else {
            req.body.files = files.files
        }
        
        next()
    }

}