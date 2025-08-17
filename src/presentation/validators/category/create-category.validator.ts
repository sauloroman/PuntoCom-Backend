import { CreateCategoryRequestDto } from "../../../application/dtos/category.dto";

export class CreateCategoryValidator {

    private static MAX_NAME_LENGTH = 100;
    private static MAX_DESCRIPTION_LENGTH = 220;

    public static validate(input: any): [CreateCategoryRequestDto?, string?] {

        if (!input.name || input.name.trim().length === 0) {
            return [undefined, 'El nombre es obligatorio'];
        } else if (input.name.length > this.MAX_NAME_LENGTH) {
            return [undefined, `El nombre no puede exceder ${this.MAX_NAME_LENGTH} caracteres`];
        }

        if ( input.description && input.description.trim().length > 0  ) {
            if ( input.description.length > this.MAX_DESCRIPTION_LENGTH ) {
                return [undefined, `La descripción no puede exceder ${this.MAX_DESCRIPTION_LENGTH} caracteres`];
            }
        }

        return [{
            name: input.name.trim(),
            description: input.description ? input.description.trim() : undefined
        }];
    }
}
