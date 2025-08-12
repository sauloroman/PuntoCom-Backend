export class Discount {
  private readonly _amount: number;

  constructor(amount: number) {
    if (amount < 0) {
      throw new Error('El descuento no puede ser negativo');
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
