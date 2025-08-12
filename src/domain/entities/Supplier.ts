import { Email } from '../value-objects/Email';
import { CompanyName } from '../value-objects';

export class Supplier {
  private readonly _id: string;
  private _name: string;
  private _lastname: string;
  private _company: CompanyName;
  private _phone: string;
  private _email: Email;
  private _address: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    lastname: string,
    company: CompanyName,
    phone: string = 'Proveedor sin teléfono',
    email: Email,
    address: string = 'Proveedor sin dirección',
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._lastname = lastname;
    this._company = company;
    this._phone = phone;
    this._email = email;
    this._address = address;
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

  get company(): CompanyName {
    return this._company;
  }

  get phone(): string {
    return this._phone;
  }

  get email(): Email {
    return this._email;
  }

  get address(): string {
    return this._address;
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
    company?: CompanyName;
    phone?: string;
    email?: Email;
    address?: string;
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
    if (params.company !== undefined) {
      this._company = params.company;
    }
    if (params.phone !== undefined) {
      this._phone = params.phone;
    }
    if (params.email !== undefined) {
      this._email = params.email;
    }
    if (params.address !== undefined) {
      this._address = params.address;
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
