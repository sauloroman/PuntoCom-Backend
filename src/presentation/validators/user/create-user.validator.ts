import { CreateUserRequestDtoI } from "../../../application/dtos/user.dto";
import { RegularExp } from "../../../config/utils";
import { RoleEnum } from "../../../domain/value-objects/Role";

export class CreateUserValidator {

    private static MAX_NAME_LENGTH = 60;
    private static MAX_LASTNAME_LENGTH = 60;
    private static MAX_PHONE_LENGTH = 12;
    private static EMAIL_REGEX = RegularExp.EMAIL_REGEX;
    private static PASSWORD_REGEX = RegularExp.PASSWORD_REGEX;

    public static validate(input: any): [CreateUserRequestDtoI?, string?] {

        if (!input.name || input.name.trim().length === 0) {
            return [undefined, 'El nombre es obligatorio'];
        } else if (input.name.length > this.MAX_NAME_LENGTH) {
            return [undefined, `El nombre no puede exceder ${this.MAX_NAME_LENGTH} caracteres`];
        }

        if (!input.lastname || input.lastname.trim().length === 0) {
            return [undefined, 'El apellido es obligatorio'];
        } else if (input.lastname.length > this.MAX_LASTNAME_LENGTH) {
            return [undefined, `El apellido no puede exceder ${this.MAX_LASTNAME_LENGTH} caracteres`];
        }

        if (!input.phone || input.phone.trim().length === 0) {
            return [undefined, 'El número telefónico es obligatorio'];
        } else if (input.phone.length > this.MAX_PHONE_LENGTH) {
            return [undefined, `El número telefónico no puede exceder ${this.MAX_PHONE_LENGTH} caracteres`];
        }

        if (!input.email || input.email.trim().length === 0) {
            return [undefined, 'El email es obligatorio'];
        } else if (!this.EMAIL_REGEX.test(input.email)) {
            return [undefined, 'El email no es válido'];
        }

        if (!input.password || input.password.trim().length === 0) {
            return [undefined, 'La contraseña es obligatoria'];
        } else if (!this.PASSWORD_REGEX.test(input.password)) {
            return [undefined, 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un caracter especial'];
        }

        if (!input.role || input.role.trim().length === 0 ) {
            return [undefined, 'El rol es obligatorio']
        } else if (!Object.values(RoleEnum).includes(input.role)) {
            return [undefined, 'El rol proporcionado no es válido'];
        }

        return [{
            name: input.name.trim(),
            lastname: input.lastname.trim(),
            email: input.email.trim(),
            password: input.password.trim(),
            role: input.role,
            phone: input.phone.trim()
        }];
    }
}
