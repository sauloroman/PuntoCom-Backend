import { DomainError } from '../errors/domain.error';

export class Quantity {
  private readonly _value: number;
  private readonly MESSAGE_ERROR: string = "QUANTITY_VALIDATION_ERROR"

  constructor(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'La cantidad debe ser un número entero positivo');
    }
    this._value = value;
  }

  public get value(): number {
    return this._value;
  }

  public equals(other: Quantity): boolean {
    return this._value === other.value;
  }
}
