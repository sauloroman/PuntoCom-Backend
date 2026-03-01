import { User } from "../../../../domain/entities";
import { Email, Password, Phone, Role } from "../../../../domain/value-objects";
import { RoleEnum } from "../../../../domain/value-objects/Role";

export class UserMapper {

    public static fromSQL(userData: any): User {
        return new User({
            id: userData.user_id,
            name: userData.user_name,
            lastname: userData.user_lastname,
            image: userData.user_image,
            email: new Email(userData.user_email),
            phone: new Phone(userData.user_phone),
            password: new Password(userData.user_password),
            role: new Role(userData.role as RoleEnum),
            isActive: userData.user_is_active,
            isValidated: userData.user_is_validated,
            createdAt: userData.user_createdAt,
            updatedAt: userData.user_updatedAt
        });
    }

}