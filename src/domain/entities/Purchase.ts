import { Money } from '../value-objects/Money';

interface PurchaseProps {
  id: string;
  date?: Date;
  total: Money;
  supplierId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Purchase {
  private readonly _id: string;
  private _date: Date;
  private _total: Money;
  private _supplierId: string;
  private _userId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({
    id,
    date = new Date(),
    total,
    supplierId,
    userId,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: PurchaseProps) {
    this._id = id;
    this._date = date;
    this._total = total;
    this._supplierId = supplierId;
    this._userId = userId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    this.validateTotal(this._total);
    this.validateSupplierId(this._supplierId);
    this.validateUserId(this._userId);
  }

  private validateTotal(total: Money) {
    if (!total) {
      throw new Error('El total de la compra es obligatorio');
    }
  }

  private validateSupplierId(supplierId: string) {
    if (!supplierId || supplierId.trim().length === 0) {
      throw new Error('El ID del proveedor es obligatorio');
    }
  }

  private validateUserId(userId: string) {
    if (!userId || userId.trim().length === 0) {
      throw new Error('El ID del usuario es obligatorio');
    }
  }

  // Getters

  get id(): string {
    return this._id;
  }

  get date(): Date {
    return this._date;
  }

  get total(): Money {
    return this._total;
  }

  get supplierId(): string {
    return this._supplierId;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Método para actualizar datos

  public update(params: {
    date?: Date;
    total?: Money;
    supplierId?: string;
    userId?: string;
  }) {
    if (params.date !== undefined) {
      this._date = params.date;
    }

    if (params.total !== undefined) {
      this.validateTotal(params.total);
      this._total = params.total;
    }

    if (params.supplierId !== undefined) {
      this.validateSupplierId(params.supplierId);
      this._supplierId = params.supplierId;
    }

    if (params.userId !== undefined) {
      this.validateUserId(params.userId);
      this._userId = params.userId;
    }

    this.touchUpdatedAt();
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date();
  }
}
