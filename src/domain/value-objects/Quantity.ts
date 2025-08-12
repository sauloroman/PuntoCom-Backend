export class Quantity {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('La cantidad debe ser un número entero positivo');
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
