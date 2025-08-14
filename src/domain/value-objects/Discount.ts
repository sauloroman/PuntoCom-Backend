import { DomainError } from "../errors/domain.error";

export class Discount {
  private readonly _amount: number;
  private readonly MESSAGE_ERROR: string = "DISCOUNT_VALIDATION_ERROR"

  constructor(amount: number) {
    if (amount < 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El descuento no puede ser negativo');
    }
    this._amount = amount;
  }

  public get value(): number {
    return this._amount;
  }

  public equals(other: Discount): boolean {
    return this._amount === other.value;
  }
}
