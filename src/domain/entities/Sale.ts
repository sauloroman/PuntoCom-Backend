import { Money } from '../value-objects/Money';

interface SaleProps {
  id: string;
  date?: Date;
  total: Money;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Sale {
  private readonly _id: string;
  private _date: Date;
  private _total: Money;
  private _userId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({
    id,
    date = new Date(),
    total,
    userId,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: SaleProps) {
    this._id = id;
    this._date = date;
    this._total = total;
    this._userId = userId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    this.validateDate(this._date);
    this.validateTotal(this._total);
    this.validateUserId(this._userId);
  }

  private validateDate(date: Date) {
    if (!date || !(date instanceof Date)) {
      throw new Error('La fecha de la venta no es válida');
    }
  }

  private validateTotal(total: Money) {
    if (!total) {
      throw new Error('El total de la venta es obligatorio');
    }
  }

  private validateUserId(userId: string) {
    if (!userId || userId.trim().length === 0) {
      throw new Error('El ID del usuario es obligatorio');
    }
  }

  get id(): string {
    return this._id;
  }

  get date(): Date {
    return this._date;
  }

  get total(): Money {
    return this._total;
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

  public update(params: {
    date?: Date;
    total?: Money;
    userId?: string;
  }) {
    if (params.date !== undefined) {
      this.validateDate(params.date);
      this._date = params.date;
    }

    if (params.total !== undefined) {
      this.validateTotal(params.total);
      this._total = params.total;
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
