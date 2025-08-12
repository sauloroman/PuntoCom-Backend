import { Email, Password, Role } from '../value-objects';

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

  constructor(
    id: string,
    name: string,
    lastname: string,
    email: Email,
    password: Password,
    role: Role,
    image: string = 'Usuario sin imagen',
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
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
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('El nombre es obligatorio');
    }
    if (!this._lastname || this._lastname.trim().length === 0) {
      throw new Error('El apellido es obligatorio');
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
      if (!params.name.trim()) throw new Error('El nombre es obligatorio');
      this._name = params.name;
    }
    if (params.lastname !== undefined) {
      if (!params.lastname.trim()) throw new Error('El apellido es obligatorio');
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
