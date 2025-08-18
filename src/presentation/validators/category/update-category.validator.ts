import { UpdateCategoryRequestDto } from "../../../application/dtos/category.dto";

export class UpdateCategoryValidator {

    private static MAX_NAME_LENGTH = 100;
    private static MAX_DESCRIPTION_LENGTH = 220;

    public static validate( input: any ): [UpdateCategoryRequestDto?, string?] {

        if ( input.name && input.name.length > 0 && input.name.length > this.MAX_NAME_LENGTH ) {
            return [undefined, `El nombre no puede exceder ${this.MAX_NAME_LENGTH} caracteres`]
        }

        if ( input.description && input.description.length > 0 && input.description.length > this.MAX_NAME_LENGTH ) {
            return [undefined, `La descripción no puede exceder ${this.MAX_DESCRIPTION_LENGTH} caracteres`]
        }

        return [{
            name: input.name ? input.name.trim() : undefined,
            description: input.description ? input.description.trim() : undefined
        }]
    }

}