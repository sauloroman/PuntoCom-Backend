export class Stock {
  private readonly _quantity: number;

  constructor( quantity: number ) {
    if( !Number.isInteger(quantity) || quantity < 0 ) {
      throw new Error('El stock debe ser un número entero no negativo')
    }
    this._quantity = quantity
  }

  public get value(): number {
    return this._quantity
  }

  public equals( other: Stock ): boolean {
    return this._quantity === other.value
  }

}