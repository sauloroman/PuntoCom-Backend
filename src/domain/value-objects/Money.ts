export class Money {

  private readonly _amount: number;
  private static QUANTITY_DECIMALS: number = 2;

  constructor( amount: number ) {
    if ( isNaN(amount) || amount <= 0 ) {
      throw new Error('El precio debe ser un número positivo')
    }
    this._amount = parseFloat(amount.toFixed(Money.QUANTITY_DECIMALS))
  }

  public get value(): number {
    return this._amount
  }

  public equals( other: Money ): boolean {
    return this._amount === other.value
  }

}