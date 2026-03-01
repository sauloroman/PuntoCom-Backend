import { Category } from "../../../../domain/entities";

export class CategoryMapper {

    public static fromSQL(categoryData: any): Category {
        return new Category({
            id: categoryData.category_id,
            name: categoryData.category_name,
            description: categoryData.category_description,
            icon: categoryData.category_icon,
            isActive: categoryData.category_is_active,
            createdAt: categoryData.category_createdAt,
            updatedAt: categoryData.category_updatedAt
        });
    }

}