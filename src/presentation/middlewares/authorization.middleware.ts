import { Request, Response, NextFunction } from "express";
import { RoleEnum } from "../../../generated/prisma";

export class ValidateRolesMiddleware {

  public static hasRole(...allowedRoles: RoleEnum[]) {
    return async (req: Request, res: Response, next: NextFunction) => {

      const user = req.body.user
      console.log(req.body.user)

      if (!user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const userRole = user.role.value as RoleEnum;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "No tienes permisos suficientes" });
      }

      next();
    }
  }

  public static isAdmin() {
    return this.hasRole(RoleEnum.Administrador);
  }
}
