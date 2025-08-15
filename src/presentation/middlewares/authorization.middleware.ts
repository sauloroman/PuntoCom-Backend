import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../../../generated/prisma";

export class ValidateRolesMiddleware {

    public isAdmin() {
        return async( req: Request, res: Response, next: NextFunction ) => {
        
        }
    }

}