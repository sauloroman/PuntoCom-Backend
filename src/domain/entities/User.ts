import { Email, Password, Role } from '../value-objects'
import { DomainError } from '../errors/domain.error';

interface UserProps {
  id: string,
  name: string,
  lastname: string,
  email: Email,
  password: Password,
  role: Role,
  isActive: boolean,
  image?: string,
  createdAt?: Date,
  updatedAt?: Date
}

export class User {
  private readonly _id: string;
  private _name: string;
  private _lastname: string;
  private _email: Email;
  private _password: Password;
  private _role: Role;
  private _image: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private static MAX_NAME_LENGTH: number = 60;
  private static MAX_LASTNAME_LENGTH: number = 60;
  private static MAX_IMAGE_LENGTH: number = 200;
  private readonly MESSAGE_ERROR: string = "USER_VALIDATION_ERROR"


  constructor({
    id,
    name,
    lastname,
    email,
    password,
    role,
    isActive = true,
    image = 'Usuario sin imagen',
    createdAt = new Date(),
    updatedAt = new Date()
  }: UserProps) {
    this._id = id;
    this._name = name;
    this._lastname = lastname;
    this._email = email;
    this._password = password;
    this._role = role;
    this._image = image;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    this.validateName(this._name);
    this.validateLastname(this._lastname);
    this.validateImage(this._image);
  }

  private validateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El nombre es obligatorio');
    }
    if (name.length > User.MAX_NAME_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `El nombre no puede exceder ${User.MAX_NAME_LENGTH} caracteres`);
    }
  }

  private validateLastname(lastname: string) {
    if (!lastname || lastname.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El apellido es obligatorio');
    }
    if (lastname.length > User.MAX_LASTNAME_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `El apellido no puede exceder ${User.MAX_LASTNAME_LENGTH} caracteres`);
    }
  }

  private validateImage(image: string) {
    if (image.length > User.MAX_IMAGE_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `La imagen no puede exceder ${User.MAX_IMAGE_LENGTH} caracteres`);
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get lastname(): string {
    return this._lastname;
  }

  get email(): Email {
    return this._email;
  }

  get password(): Password {
    return this._password;
  }

  get role(): Role {
    return this._role;
  }

  get image(): string {
    return this._image;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public activate() {
    this._isActive = true;
    this.touchUpdatedAt();
  }

  public deactivate() {
    this._isActive = false;
    this.touchUpdatedAt();
  }

  public update(params: {
    name?: string;
    lastname?: string;
    email?: Email;
    password?: Password;
    role?: Role;
    image?: string;
    isActive?: boolean;
  }) {
    if (params.name !== undefined) {
      this.validateName(params.name);
      this._name = params.name;
    }
    if (params.lastname !== undefined) {
      this.validateLastname(params.lastname);
      this._lastname = params.lastname;
    }
    if (params.email !== undefined) {
      this._email = params.email;
    }
    if (params.password !== undefined) {
      this._password = params.password;
    }
    if (params.role !== undefined) {
      this._role = params.role;
    }
    if (params.image !== undefined) {
      this.validateImage(params.image);
      this._image = params.image;
    }
    if (params.isActive !== undefined) {
      this._isActive = params.isActive;
    }
    this.touchUpdatedAt();
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date();
  }
}
