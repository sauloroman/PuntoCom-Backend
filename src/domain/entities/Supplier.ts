import { Email, Phone } from '../value-objects';
import { DomainError } from '../errors/domain.error';

interface SupplierProps {
  id?: string;
  name: string;
  lastname: string;
  company: string;
  phone: Phone;
  email: Email;
  address?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Supplier {
  private readonly _id?: string;
  private _name: string;
  private _lastname: string;
  private _company: string;
  private _phone: Phone;
  private _email: Email;
  private _address: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private static MAX_NAME_LENGTH: number = 100;
  private static MAX_LASTNAME_LENGTH: number = 100;
  private static MAX_COMPANY_LENGTH: number = 100;
  private static MAX_ADDRESS_LENGTH: number = 200;
  private readonly MESSAGE_ERROR: string = "SUPPLIER_VALIDATION_ERROR"


  constructor({
    id = '',
    name,
    lastname,
    company,
    email,
    phone,
    address = 'Proveedor sin dirección',
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: SupplierProps) {
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
    this.validateName(this._name);
    this.validateLastname(this._lastname);
    this.validateCompany(this._company);
    this.validateAddress(this._address);
  }

  private validateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El nombre es obligatorio');
    }
    if (name.length > Supplier.MAX_NAME_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `El nombre no puede exceder ${Supplier.MAX_NAME_LENGTH} caracteres`);
    }
  }

  private validateLastname(lastname: string) {
    if (!lastname || lastname.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El apellido es obligatorio');
    }
    if (lastname.length > Supplier.MAX_LASTNAME_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `El apellido no puede exceder ${Supplier.MAX_LASTNAME_LENGTH} caracteres`);
    }
  }

  private validateCompany(company: string) {
    if (!company || company.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'La compañía es obligatoria');
    }
    if (company.length > Supplier.MAX_COMPANY_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `La compañía no puede exceder ${Supplier.MAX_COMPANY_LENGTH} caracteres`);
    }
  }

  private validateAddress(address: string) {
    if (address.length > Supplier.MAX_ADDRESS_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `La dirección no puede exceder ${Supplier.MAX_ADDRESS_LENGTH} caracteres`);
    }
  }

  get id(): string {
    return this._id ?? '';
  }

  get name(): string {
    return this._name;
  }

  get lastname(): string {
    return this._lastname;
  }

  get company(): string {
    return this._company;
  }

  get phone(): Phone {
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
    company?: string;
    phone?: Phone;
    email?: Email;
    address?: string;
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
    if (params.company !== undefined) {
      this.validateCompany(params.company);
      this._company = params.company;
    }
    if (params.phone !== undefined) {
      this._phone = params.phone;
    }
    if (params.email !== undefined) {
      this._email = params.email;
    }
    if (params.address !== undefined) {
      this.validateAddress(params.address);
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
