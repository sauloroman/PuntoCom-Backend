import { Money } from '../value-objects/Money';
import { DomainError } from '../errors/domain.error';
import { SaleCode } from '../value-objects';

interface SaleProps {
  id?: string;
  date: Date;
  code: SaleCode,
  total: Money;
  userId: string;
}

export class Sale {
  private readonly _id: string;
  private _date: Date;
  private _total: Money;
  private _userId: string;
  private _code: SaleCode;

  private readonly MESSAGE_ERROR: string = "SALE_VALIDATION_ERROR"

  constructor({
    id = '',
    date,
    total,
    code,
    userId,
  }: SaleProps) {
    this._id = id;
    this._date = date;
    this._code = code;
    this._total = total;
    this._userId = userId;

    this.validate();
  }

  private validate() {
    this.validateDate(this._date);
    this.validateTotal(this._total);
    this.validateUserId(this._userId);
  }

  private validateDate(date: Date) {
    if (!date || !(date instanceof Date)) {
      throw new DomainError( this.MESSAGE_ERROR, 'La fecha de la venta no es válida');
    }
  }

  private validateTotal(total: Money) {
    if (!total) {
      throw new DomainError( this.MESSAGE_ERROR, 'El total de la venta es obligatorio');
    }
  }

  private validateUserId(userId: string) {
    if (!userId || userId.trim().length === 0) {
      throw new DomainError( this.MESSAGE_ERROR, 'El ID del usuario es obligatorio');
    }
  }

  get id(): string {
    return this._id && '';
  }

  get date(): Date {
    return this._date;
  }

  get total(): Money {
    return this._total;
  }

  get code(): SaleCode {
    return this._code
  }

  get userId(): string {
    return this._userId;
  }

  public update(params: {
    date?: Date;
    total?: Money;
    code?: SaleCode;
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

    if (params.code !== undefined) {
      this._code = params.code;
    }

    if (params.userId !== undefined) {
      this.validateUserId(params.userId);
      this._userId = params.userId;
    }
  }
}
