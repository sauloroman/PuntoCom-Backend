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
        saleTotal: 'sale_total',
        purchaseDate: 'purchase_date',
        purchaseTotal: 'purchase_total',
        purchaseSupplier: 'supplier_id',
        purchaseUser: 'user_id',
        inventoryAdjustmentDate: 'adjustment_date',
        inventoryAdjustmentType: 'adjustment_type',
        inventoryAdjustmentUser: 'user_id'
    },
    mssql: {
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
        saleTotal: 'sale_total',
        purchaseDate: 'purchase_date',
        purchaseTotal: 'purchase_total',
        purchaseSupplier: 'supplier_id',
        purchaseUser: 'user_id',
        inventoryAdjustmentDate: 'adjustment_date',
        inventoryAdjustmentType: 'adjustment_type',
        inventoryAdjustmentUser: 'user_id'
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

    public static ToMssql() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { sort, filter } = req.query;

            let mappedSort: string | undefined;
            if (sort && typeof sort === "string") {
                const [field, order] = sort.split(":");
                const mappedField = fieldMap.mssql[field] || field;
                const sqlOrder = (order?.toLowerCase() === "desc") ? "DESC" : "ASC";
                mappedSort = `${mappedField} ${sqlOrder}`;
            }

            let mappedFilter: string | undefined;
            if (filter && typeof filter === "string") {
                try {
                    const parsedFilter = JSON.parse(filter);
                    const conditions: string[] = [];

                    for (const [key, value] of Object.entries(parsedFilter)) {
                        const mappedField = fieldMap.mssql[key] || key;
                        
                        if (typeof value === "string") {
                            conditions.push(`${mappedField} = '${value.replace(/'/g, "''")}'`);
                        } else if (typeof value === "number") {
                            conditions.push(`${mappedField} = ${value}`);
                        } else if (typeof value === "boolean") {
                            conditions.push(`${mappedField} = ${value ? 1 : 0}`);
                        }
                    }

                    mappedFilter = conditions.length > 0 ? conditions.join(" AND ") : "1=1";
                } catch (err) {
                    return res.status(400).json({ message: "Filter no es un JSON válido" });
                }
            }

            (req as any).sort = mappedSort || "user_createdAt DESC";
            (req as any).filter = mappedFilter || "1=1";

            next();
        };
    }

    public static ToMssqlContains() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { sort, filter } = req.query;

            let mappedSort: string | undefined;
            if (sort && typeof sort === "string") {
                const [field, order] = sort.split(":");
                const mappedField = fieldMap.mssql[field] || field;
                const sqlOrder = (order?.toLowerCase() === "desc") ? "DESC" : "ASC";
                mappedSort = `${mappedField} ${sqlOrder}`;
            }

            let mappedFilter: string | undefined;
            if (filter && typeof filter === "string") {
                try {
                    const parsedFilter = JSON.parse(filter);
                    const conditions: string[] = [];

                    for (const [key, value] of Object.entries(parsedFilter)) {
                        const mappedField = fieldMap.mssql[key] || key;
                        
                        if (typeof value === "string") {
                            const escapedValue = value.replace(/'/g, "''");
                            conditions.push(`LOWER(${mappedField}) LIKE LOWER('%${escapedValue}%')`);
                        } else if (typeof value === "number") {
                            conditions.push(`${mappedField} = ${value}`);
                        } else if (typeof value === "boolean") {
                            conditions.push(`${mappedField} = ${value ? 1 : 0}`);
                        }
                    }

                    mappedFilter = conditions.length > 0 ? conditions.join(" AND ") : "1=1";
                } catch (err) {
                    return res.status(400).json({ message: "Filter no es un JSON válido" });
                }
            }

            (req as any).sort = mappedSort || "user_createdAt DESC";
            (req as any).filter = mappedFilter || "1=1";

            next();
        };
    }
}