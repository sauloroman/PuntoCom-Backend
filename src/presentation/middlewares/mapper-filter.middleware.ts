import { NextFunction, Request, Response } from "express";

const fieldMap: Record<string, Record<string, string>> = {
    prisma: {
        userName: "user_name",
        userStatus: "user_is_active",
        userCreatedAt: "user_createdAt",
        userRole: "role",
        categoryName: "category_name",
        categoryStatus: "category_is_active",
        categoryCreatedAt: "category_createdAt",
        supplierName: 'supplier_name',
        supplierStatus: 'supplier_is_active',
        supplierCompany: "supplier_company",
        supplierCreatedAt: 'supplier_createdAt',
        productName: 'product_name',
        productStatus: 'product_is_active',
        productCreatedAt: 'product_createdAt',
        productCategory: 'category_id',
        productSupplier: 'supplier_id',
        saleDate: 'sale_date',
        saleTotal: 'sale_total'
    }
};

export class MapperFilterMiddleware {

    public static ToPrisma() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { sort, filter } = req.query;

            let mappedSort: Record<string, "asc" | "desc"> | undefined;
            if (sort && typeof sort === "string") {
                const [field, order] = sort.split(":");
                const mappedField = fieldMap.prisma[field] || field; 
                mappedSort = { [mappedField]: (order as "asc" | "desc") || "asc" };
            }

            let mappedFilter: Record<string, any> | undefined;
            if (filter && typeof filter === "string") {
                try {
                    const parsedFilter = JSON.parse(filter);
                    mappedFilter = Object.fromEntries(
                        Object.entries(parsedFilter).map(([key, value]) => [
                            fieldMap.prisma[key] || key, 
                            value
                        ])
                    );
                } catch (err) {
                    return res.status(400).json({ message: "Filter no es un JSON válido" });
                }
            }

            (req as any).sort = mappedSort;
            (req as any).filter = mappedFilter;

            next();
        };
    }

    public static ToPrismaContains() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { sort, filter } = req.query;

            let mappedSort: Record<string, "asc" | "desc"> | undefined;
            if (sort && typeof sort === "string") {
                const [field, order] = sort.split(":");
                const mappedField = fieldMap.prisma[field] || field;
                mappedSort = { [mappedField]: (order as "asc" | "desc") || "asc" };
            }

            let mappedFilter: Record<string, any> | undefined;
            if (filter && typeof filter === "string") {
                try {
                    const parsedFilter = JSON.parse(filter);
                    const temp = Object.fromEntries(
                        Object.entries(parsedFilter).map(([key, value]) => [
                            fieldMap.prisma[key] || key,
                            value
                        ])
                    );

                    mappedFilter = Object.fromEntries(
                        Object.entries(temp).map(([key, value]) => {
                            if (typeof value === "string") {
                                return [key, { contains: value, mode: "insensitive" }];
                            }
                            return [key, value];
                        })
                    );
                } catch (err) {
                    return res.status(400).json({ message: "Filter no es un JSON válido" });
                }
            }

            (req as any).sort = mappedSort;
            (req as any).filter = mappedFilter;

            next();
        };
    }
}
